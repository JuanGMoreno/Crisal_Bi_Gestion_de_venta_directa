const InventoryUrls = {
    'inventory:create': '/system/inventory/create',
    'inventory:edit': (id: string) => `/system/inventory/${id}/edit`,
}

export default InventoryUrls;
