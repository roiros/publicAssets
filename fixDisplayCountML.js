try {
  let originalFixedCount = 0; let positiveCount = 0; let undefinedCount = 0; let translatedFixedCount = 0
  const originalLanguage = documentServices.language.original.get()
  const languages = documentServices.language.get()
  const nonOriginalLanguages = languages.filter(language => language.code !== originalLanguage.code)

  const isMultilingualEnabled = documentServices.language.multilingual.isEnabled()

  const allMenus = _.map(documentServices.menu.getAll(), 'id')

  const getItems = (obj) => { if (obj.items) { return [obj, ...obj.items.map(getItems)] } else return [obj] }

  const itemsByMenuInLang = (langCode, menuId) => ({ menuId, items: _.flatMapDeep(documentServices.multilingual.menu.get(langCode, menuId).items, getItems) })
  const updateFunctionInLang = (langCode) => _.partial(documentServices.multilingual.menu.updateItem, langCode)

  const runUpdateItems = (itemsByMenu, updateFunction, accFunc) => {
    itemsByMenu.forEach(({ menuId, items }) => {
      items.forEach(menuItem => {
        if (menuItem.displayCount === 0) {
          menuItem.displayCount = null
          accFunc()
          updateFunction(menuId, menuItem.id,
            // _.pick(
            menuItem
            // , ['id', 'type', 'displayCount'])
          )
        } else if (menuItem.displayCount > 0) {
          positiveCount++
        } else if (menuItem.displayCount === undefined) {
          undefinedCount++
        }
      })
    })
  }

  const originalLanguageItemsByMenu = allMenus.map(menuId => itemsByMenuInLang(originalLanguage.code, menuId))
  const updateOriginalLanguageFunction = updateFunctionInLang(originalLanguage.code)

  runUpdateItems(originalLanguageItemsByMenu, updateOriginalLanguageFunction, () => { originalFixedCount++ })

  nonOriginalLanguages.forEach(language => {
    const languageItemsByMenu = allMenus.map(menuId => itemsByMenuInLang(language.code, menuId))
    runUpdateItems(languageItemsByMenu, updateFunctionInLang(language.code), () => { translatedFixedCount++ })
  })

  window.autopilot.reportResult({
    isMultilingualEnabled,
    mockRun: false,
    originalFixedCount,
    translatedFixedCount,
    positiveCount,
    undefinedCount
  })
} catch (e) {
  window.autopilot.reportError(e)
}
