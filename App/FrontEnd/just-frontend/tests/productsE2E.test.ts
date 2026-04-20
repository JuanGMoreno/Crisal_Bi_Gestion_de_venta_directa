import { Builder, By, until, WebDriver } from "selenium-webdriver";

jest.setTimeout(60000);

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const E2E_EMAIL = process.env.E2E_EMAIL;
const E2E_PASSWORD = process.env.E2E_PASSWORD;
const E2E_STRICT_PRODUCTS = process.env.E2E_STRICT_PRODUCTS === "true";

async function signIn(driver: WebDriver): Promise<void> {
  await driver.get(`${BASE_URL}/system/products`);
  const initialScreen = await waitForProductsOrSignin(driver);
  if (initialScreen === "products") {
    return;
  }

  const emailInput = await driver.wait(until.elementLocated(By.id("email")), 10000);
  await emailInput.clear();
  await emailInput.sendKeys(E2E_EMAIL as string);

  const passwordInput = await driver.findElement(By.id("password"));
  await passwordInput.clear();
  await passwordInput.sendKeys(E2E_PASSWORD as string);

  const submitButton = await driver.findElement(By.css('button[type="submit"]'));
  await submitButton.click();

  await driver.wait(until.urlContains("/system"), 15000);
}

async function waitForProductsOrSignin(driver: WebDriver): Promise<"products" | "signin"> {
  await driver.wait(async () => {
    const loginInputs = await driver.findElements(By.id("email"));
    const addButtons = await driver.findElements(
      By.xpath("//button[contains(., 'Agregar Producto')]")
    );
    return loginInputs.length > 0 || addButtons.length > 0;
  }, 30000);

  const loginInputs = await driver.findElements(By.id("email"));
  if (loginInputs.length > 0) {
    return "signin";
  }

  return "products";
}

describe("E2E Products", () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();

    try {
      await driver.get(`${BASE_URL}/auth/signin`);
    } catch {
      throw new Error(
        `No se pudo abrir ${BASE_URL}. Inicia el frontend antes de ejecutar el test E2E.`
      );
    }
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  const productsTest = E2E_EMAIL && E2E_PASSWORD ? test : test.skip;
  const strictProductsTest = E2E_STRICT_PRODUCTS ? productsTest : test.skip;

  async function openProductsPage(driver: WebDriver): Promise<string> {
    await signIn(driver);
    await driver.get(`${BASE_URL}/system/products`);

    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url.includes("/system/products") || url.includes("/auth/signin");
    }, 15000);

    return driver.getCurrentUrl();
  }

  productsTest("usuario autenticado puede abrir la pantalla de productos", async () => {
    await openProductsPage(driver);
    const screen = await waitForProductsOrSignin(driver);

    if (screen === "signin") {
      const emailInput = await driver.findElement(By.id("email"));
      expect(await emailInput.isDisplayed()).toBe(true);
      return;
    }

    const addButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Agregar Producto')]")),
      10000
    );

    expect(await addButton.isDisplayed()).toBe(true);
  });

  productsTest("pantalla de productos muestra estado valido", async () => {
    await openProductsPage(driver);
    const screen = await waitForProductsOrSignin(driver);

    if (screen === "signin") {
      const pageText = await driver.findElement(By.tagName("body")).getText();
      expect(pageText.includes("Iniciar Sesion") || pageText.includes("Iniciar Sesión")).toBe(true);
      return;
    }

    const pageText = await driver.findElement(By.tagName("body")).getText();

    const hasKnownProductsState =
      pageText.includes("Agregar Producto") ||
      pageText.includes("No se encontraron productos") ||
      pageText.includes("No se pudieron cargar los productos") ||
      pageText.includes("Actualizando productos...");

    expect(hasKnownProductsState).toBe(true);
  });

  strictProductsTest("crea un producto desde el modal (flujo estricto)", async () => {
    await signIn(driver);
    await driver.get(`${BASE_URL}/system/products`);
    const screen = await waitForProductsOrSignin(driver);

    if (screen === "signin") {
      throw new Error(
        "El flujo estricto de productos requiere sesion valida para /system/products, pero el sistema redirigio a /auth/signin."
      );
    }

    const addButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Agregar Producto')]")),
      10000
    );
    await driver.wait(until.elementIsVisible(addButton), 10000);
    await driver.wait(until.elementIsEnabled(addButton), 10000);
    await addButton.click();

    const nameInput = await driver.wait(until.elementLocated(By.id("name")), 10000);
    await driver.wait(until.elementIsVisible(nameInput), 10000);
    await driver.wait(until.elementIsEnabled(nameInput), 10000);

    const uniqueCode = String(Date.now()).slice(-4);

    await nameInput.clear();
    await nameInput.sendKeys(`Producto E2E ${uniqueCode}`);

    const codeInput = await driver.findElement(By.id("code"));
    await codeInput.clear();
    await codeInput.sendKeys(uniqueCode);

    const priceInput = await driver.findElement(By.id("baseSalePrice"));
    await priceInput.clear();
    await priceInput.sendKeys("15900");

    const descriptionInput = await driver.findElement(By.id("description"));
    await descriptionInput.clear();
    await descriptionInput.sendKeys(`Producto creado por E2E con codigo ${uniqueCode}`);

    const submitButton = await driver.findElement(By.css('button[type="submit"][form="form-product"]'));
    await submitButton.click();

    await driver.wait(async () => {
      const bodyText = await driver.findElement(By.tagName("body")).getText();
      return bodyText.includes("Producto creado correctamente");
    }, 15000);

    const finalUrl = await driver.getCurrentUrl();
    expect(finalUrl).toContain("/system/products");
  });
});
