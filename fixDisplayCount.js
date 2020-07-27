try {
  let fixedCount = 0, positiveCount = 0, undefinedCount = 0
  const menus = documentServices.menu.getAll()
  menus.forEach(menu => {
    if (menu.items) {
      const itemsStack = []
      itemsStack.push(...menu.items)

      while (itemsStack.length) {
        const menuItem = itemsStack.pop()
        if (menuItem.items) {
          itemsStack.push(...menuItem.items)
        }

        if (menuItem.displayCount === 0) {
          menuItem.displayCount = undefined;
          fixedCount++
          documentServices.menu.updateItem(menu.id, menuItem.id, menuItem)
        } else if (menuItem.displayCount > 0) {
          positiveCount++
        } else if (menuItem.displayCount === undefined) {
          undefinedCount++
        }
      }
    }
  })
  return {fixedCount,
    positiveCount,
    undefinedCount}

  window.autopilotJsonp({
    fixedCount,
    positiveCount,
    undefinedCount
  })
} catch (e) {
  window.autopilotJsonp(null, e)
}
