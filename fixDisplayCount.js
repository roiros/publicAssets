try {
  let fixedCount = 0, positiveCount = 0, undefinedCount = 0
  const isMultilingualEnabled = documentServices.language.multilingual.isEnabled()

  const menus = documentServices.menu.getAll()

  const getItems = (obj) => { if (obj.items) { return [obj, ...obj.items.map(getItems)] } else return [obj] }
  const itemsByMenu = menus.map(menu => ({ menuId: menu.id, items: _.flatMapDeep(menu.items, getItems) }))

  itemsByMenu.forEach(({ menuId, items }) => {
    items.forEach(menuItem => {
      if (menuItem.displayCount === 0) {
        menuItem.displayCount = undefined;
        fixedCount++
        documentServices.menu.updateItem(menuId, menuItem.id, menuItem)
      } else if (menuItem.displayCount > 0) {
        positiveCount++
      } else if (menuItem.displayCount === undefined) {
        undefinedCount++
      }
    })
  })

  window.autopilotJsonp({
    isMultilingualEnabled,
    fixedCount,
    positiveCount,
    undefinedCount
  })
} catch (e) {
  window.autopilotJsonp(null, e)
}
