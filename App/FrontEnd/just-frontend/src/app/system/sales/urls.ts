const SaleUrls = {
    'sales:create': '/system/sales/create',
    'sales:edit': (id: string) => `/system/sales/${id}/edit`,
}

export default SaleUrls;
