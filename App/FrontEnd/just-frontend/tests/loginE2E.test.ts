import { Builder, By, until, WebDriver } from "selenium-webdriver";

jest.setTimeout(45000);

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const E2E_EMAIL = process.env.E2E_EMAIL;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

describe("E2E Auth - Signin", () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();

    // Falla temprano con mensaje claro si el frontend no esta levantado.
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

  test("renderiza el formulario de inicio de sesion", async () => {
    await driver.get(`${BASE_URL}/auth/signin`);

    const emailInput = await driver.wait(until.elementLocated(By.id("email")), 10000);
    const passwordInput = await driver.wait(until.elementLocated(By.id("password")), 10000);
    const submitButton = await driver.wait(
      until.elementLocated(By.css('button[type="submit"]')),
      10000
    );

    expect(await emailInput.isDisplayed()).toBe(true);
    expect(await passwordInput.isDisplayed()).toBe(true);
    expect(await submitButton.isDisplayed()).toBe(true);
  });

  const loginTest = E2E_EMAIL && E2E_PASSWORD ? test : test.skip;

  loginTest("inicia sesion y redirige al sistema", async () => {
    await driver.get(`${BASE_URL}/auth/signin`);

    const emailInput = await driver.wait(until.elementLocated(By.id("email")), 10000);
    await emailInput.clear();
    await emailInput.sendKeys(E2E_EMAIL as string);

    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.clear();
    await passwordInput.sendKeys(E2E_PASSWORD as string);

    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();

    await driver.wait(until.urlContains("/system"), 15000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/system");
  });
});