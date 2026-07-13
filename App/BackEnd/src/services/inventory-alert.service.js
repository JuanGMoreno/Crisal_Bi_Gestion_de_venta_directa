import { InventoryAlertDeliveryRepository } from '../repositories/inventory-alert-delivery.repository.js';
import { EmailService } from './email.service.js';

export const INVENTORY_ALERT_TYPES = {
  LOW_STOCK: 'LOW_STOCK',
  EXPIRING_OR_EXPIRED: 'EXPIRING_OR_EXPIRED'
};

export const INVENTORY_ALERT_RULES = {
  LOW_STOCK_THRESHOLD: 5,
  EXPIRING_DAYS_THRESHOLD: 30
};

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function formatAlertDate(date = new Date()) {
  return startOfDay(date).toISOString().slice(0, 10);
}

export function getDaysUntil(dateValue, referenceDate = new Date()) {
  const reference = startOfDay(referenceDate);
  const target = startOfDay(new Date(dateValue));

  return Math.ceil((target.getTime() - reference.getTime()) / 86400000);
}

export function buildInventoryAlertState({ stockTotal, expirationDates = [], referenceDate = new Date() }) {
  const lowStockActive = Number(stockTotal || 0) <= INVENTORY_ALERT_RULES.LOW_STOCK_THRESHOLD;
  const cutoff = addDays(startOfDay(referenceDate), INVENTORY_ALERT_RULES.EXPIRING_DAYS_THRESHOLD);
  const expiringDates = expirationDates
    .map((date) => new Date(date))
    .filter((date) => !Number.isNaN(date.getTime()))
    .filter((date) => startOfDay(date).getTime() <= cutoff.getTime())
    .sort((left, right) => left.getTime() - right.getTime());
  const nearestExpiration = expiringDates[0] || null;
  const daysUntilExpiration = nearestExpiration
    ? getDaysUntil(nearestExpiration, referenceDate)
    : null;

  return {
    stock_bajo: {
      activa: lowStockActive,
      umbral: INVENTORY_ALERT_RULES.LOW_STOCK_THRESHOLD,
      stock_total: Number(stockTotal || 0)
    },
    vencimiento: {
      activa: Boolean(nearestExpiration),
      estado:
        nearestExpiration && daysUntilExpiration < 0
          ? 'vencido'
          : nearestExpiration
            ? 'por_vencer'
            : 'sin_alerta',
      dias_para_vencer: daysUntilExpiration,
      fecha_mas_cercana: nearestExpiration ? nearestExpiration.toISOString() : null,
      lotes_en_alerta: expiringDates.length,
      umbral_dias: INVENTORY_ALERT_RULES.EXPIRING_DAYS_THRESHOLD
    }
  };
}

function buildAlertEntries(items) {
  const entries = [];

  for (const item of items) {
    if (item.alertas?.stock_bajo?.activa) {
      entries.push({
        product: item,
        type: INVENTORY_ALERT_TYPES.LOW_STOCK,
        metadata: {
          stock_total: item.stock_total,
          umbral: item.alertas.stock_bajo.umbral
        }
      });
    }

    if (item.alertas?.vencimiento?.activa) {
      entries.push({
        product: item,
        type: INVENTORY_ALERT_TYPES.EXPIRING_OR_EXPIRED,
        metadata: {
          estado: item.alertas.vencimiento.estado,
          fecha_mas_cercana: item.alertas.vencimiento.fecha_mas_cercana,
          dias_para_vencer: item.alertas.vencimiento.dias_para_vencer,
          lotes_en_alerta: item.alertas.vencimiento.lotes_en_alerta
        }
      });
    }
  }

  return entries;
}

function describeAlert(entry) {
  if (entry.type === INVENTORY_ALERT_TYPES.LOW_STOCK) {
    return `Stock bajo: ${entry.product.nombre} (${entry.product.codigo}) tiene ${entry.product.stock_total} unidades disponibles.`;
  }

  const days = entry.metadata.dias_para_vencer;
  const timing =
    days < 0
      ? `vencio hace ${Math.abs(days)} dia${Math.abs(days) === 1 ? '' : 's'}`
      : days === 0
        ? 'vence hoy'
        : `vence en ${days} dia${days === 1 ? '' : 's'}`;

  return `Vencimiento: ${entry.product.nombre} (${entry.product.codigo}) ${timing}.`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(value) {
  if (!value) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

function getAlertPresentation(entry) {
  if (entry.type === INVENTORY_ALERT_TYPES.LOW_STOCK) {
    return {
      label: 'Stock bajo',
      toneColor: '#e11d48',
      toneBackground: '#fff1f2',
      detail: `${entry.product.stock_total} unidades disponibles`,
      action: 'Prioriza reposicion o revisa disponibilidad para ventas abiertas.'
    };
  }

  const days = entry.metadata.dias_para_vencer;
  const isExpired = days < 0;

  return {
    label: isExpired ? 'Producto vencido' : 'Por vencer',
    toneColor: isExpired ? '#e11d48' : '#d97706',
    toneBackground: isExpired ? '#fff1f2' : '#fffbeb',
    detail:
      days < 0
        ? `Vencio hace ${Math.abs(days)} dia${Math.abs(days) === 1 ? '' : 's'}`
        : days === 0
          ? 'Vence hoy'
          : `Vence en ${days} dia${days === 1 ? '' : 's'}`,
    action: `Fecha mas cercana: ${formatDate(entry.metadata.fecha_mas_cercana)}`
  };
}

function buildAlertRows(entries) {
  return entries
    .map((entry) => {
      const presentation = getAlertPresentation(entry);

      return `
        <tr>
          <td style="padding:16px 18px;border-bottom:1px solid #e5e7eb;">
            <div style="font-size:15px;font-weight:700;color:#0f172a;line-height:1.35;">
              ${escapeHtml(entry.product.nombre)}
            </div>
            <div style="margin-top:4px;font-size:12px;color:#64748b;">
              Codigo ${escapeHtml(entry.product.codigo)} &bull; ${escapeHtml(entry.product.categoria || 'Sin categoria')}
            </div>
          </td>
          <td style="padding:16px 18px;border-bottom:1px solid #e5e7eb;text-align:center;">
            <span style="display:inline-block;border-radius:999px;padding:6px 10px;background:${presentation.toneBackground};color:${presentation.toneColor};font-size:12px;font-weight:700;">
              ${escapeHtml(presentation.label)}
            </span>
          </td>
          <td style="padding:16px 18px;border-bottom:1px solid #e5e7eb;">
            <div style="font-size:14px;font-weight:700;color:#0f172a;">
              ${escapeHtml(presentation.detail)}
            </div>
            <div style="margin-top:4px;font-size:12px;color:#64748b;line-height:1.4;">
              ${escapeHtml(presentation.action)}
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function buildEmailContent(entries) {
  const lines = entries.map(describeAlert);
  const lowStockCount = entries.filter((entry) => entry.type === INVENTORY_ALERT_TYPES.LOW_STOCK).length;
  const expiryCount = entries.filter((entry) => entry.type === INVENTORY_ALERT_TYPES.EXPIRING_OR_EXPIRED).length;
  const text = [
    'Tienes alertas de inventario pendientes:',
    '',
    ...lines.map((line) => `- ${line}`),
    '',
    'Revisa tu inventario para priorizar reposicion o salida de productos.'
  ].join('\n');
  const html = `
    <!doctype html>
    <html lang="es">
      <body style="margin:0;padding:0;background:#f3f7fb;font-family:Poppins,Arial,Helvetica,sans-serif;color:#0f172a;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f7fb;padding:28px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;overflow:hidden;border-radius:22px;background:#ffffff;border:1px solid #dbeafe;box-shadow:0 18px 45px rgba(15,23,42,0.10);">
                <tr>
                  <td style="background:#00509e;background-image:linear-gradient(135deg,#00509e 0%,#06366f 64%,#34a853 135%);padding:28px 30px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <div style="display:inline-block;border-radius:18px;background:#ffffff;padding:12px 16px;box-shadow:0 10px 24px rgba(0,0,0,0.14);">
                            <div style="font-size:30px;line-height:1;font-weight:500;letter-spacing:-0.03em;color:#061d49;">
                              Crisal<span style="font-weight:800;color:#0070d9;">Bi</span>
                            </div>
                            <div style="margin-top:8px;font-size:9px;letter-spacing:0.34em;text-transform:uppercase;color:#64748b;font-weight:700;">
                              Gestiona<span style="color:#34a853;">.</span> Analiza<span style="color:#34a853;">.</span> Crece<span style="color:#0070d9;">.</span>
                            </div>
                          </div>
                        </td>
                        <td align="right" style="vertical-align:middle;color:#dbeafe;font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">
                          Alertas de inventario
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin:26px 0 8px;font-size:28px;line-height:1.18;color:#ffffff;font-weight:800;letter-spacing:-0.01em;">
                      Hay productos que necesitan tu atencion
                    </h1>
                    <p style="margin:0;color:#dbeafe;font-size:15px;line-height:1.6;">
                      Detectamos stock bajo, productos vencidos o proximos a vencer en tu inventario.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 30px 10px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:14px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;text-align:center;">
                          <div style="font-size:26px;font-weight:800;color:#00509e;">${entries.length}</div>
                          <div style="font-size:12px;color:#475569;font-weight:700;text-transform:uppercase;">alertas</div>
                        </td>
                        <td width="12"></td>
                        <td style="padding:14px;border-radius:16px;background:#fff1f2;border:1px solid #fecdd3;text-align:center;">
                          <div style="font-size:26px;font-weight:800;color:#e11d48;">${lowStockCount}</div>
                          <div style="font-size:12px;color:#475569;font-weight:700;text-transform:uppercase;">stock bajo</div>
                        </td>
                        <td width="12"></td>
                        <td style="padding:14px;border-radius:16px;background:#fffbeb;border:1px solid #fde68a;text-align:center;">
                          <div style="font-size:26px;font-weight:800;color:#d97706;">${expiryCount}</div>
                          <div style="font-size:12px;color:#475569;font-weight:700;text-transform:uppercase;">vencimiento</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 30px 30px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
                      <thead>
                        <tr style="background:#f8fafc;">
                          <th align="left" style="padding:13px 18px;font-size:12px;color:#475569;text-transform:uppercase;letter-spacing:0.04em;">Producto</th>
                          <th align="center" style="padding:13px 18px;font-size:12px;color:#475569;text-transform:uppercase;letter-spacing:0.04em;">Alerta</th>
                          <th align="left" style="padding:13px 18px;font-size:12px;color:#475569;text-transform:uppercase;letter-spacing:0.04em;">Detalle</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${buildAlertRows(entries)}
                      </tbody>
                    </table>
                    <div style="margin-top:22px;padding:16px 18px;border-radius:16px;background:#f8fafc;border-left:5px solid #34a853;color:#334155;font-size:14px;line-height:1.6;">
                      Revisa tu inventario para priorizar reposicion, promociones o salida de productos antes de que pierdan valor.
                    </div>
                    <p style="margin:22px 0 0;color:#94a3b8;font-size:12px;line-height:1.5;text-align:center;">
                      CrisalBi envia este correo como maximo una vez al dia por producto y tipo de alerta.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return {
    subject: `CrisalBi - Alertas de inventario (${entries.length})`,
    text,
    html
  };
}

export const InventoryAlertService = {
  notifyDailyAlerts: async ({ distributorId, recipientEmail, items, referenceDate = new Date() }) => {
    if (!recipientEmail || !Array.isArray(items) || items.length === 0) {
      return { sent: 0, skipped: 0 };
    }

    const alertDate = formatAlertDate(referenceDate);
    const pendingEntries = [];
    const skippedEntries = [];

    for (const entry of buildAlertEntries(items)) {
      const existing = await InventoryAlertDeliveryRepository.findByDailyKey({
        distributorId,
        productId: entry.product.id_producto,
        alertType: entry.type,
        alertDate
      });

      if (existing) {
        skippedEntries.push(entry);
      } else {
        pendingEntries.push(entry);
      }
    }

    if (pendingEntries.length === 0) {
      return { sent: 0, skipped: skippedEntries.length };
    }

    const emailContent = buildEmailContent(pendingEntries);
    const deliveryResult = await EmailService.sendMail({
      to: recipientEmail,
      ...emailContent
    });

    if (deliveryResult?.skipped) {
      return { sent: 0, skipped: skippedEntries.length, emailSkipped: true };
    }

    for (const entry of pendingEntries) {
      await InventoryAlertDeliveryRepository.create({
        id_distribuidor: distributorId,
        id_producto: entry.product.id_producto,
        alert_type: entry.type,
        recipient_email: recipientEmail,
        sent_at: referenceDate,
        alert_date: alertDate,
        metadata: entry.metadata
      });
    }

    return { sent: pendingEntries.length, skipped: skippedEntries.length };
  }
};
