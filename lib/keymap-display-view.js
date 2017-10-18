'use babel'

export default class KeymapDisplayView {
  constructor (serializedState) {
    // Create root element.
    this.element = document.createElement('div')
    this.element.classList.add('atom-keymap-display-package')

    // Create content container of custom keyboard shortcuts.
    const content = document.createElement('div')
    content.classList.add('content')

    // Create and add main heading.
    const mainHeading = document.createElement('div')
    mainHeading.classList.add('main-heading')
    // Adds textContent to main heading
    const toggleCommand = window.atom.keymaps.findKeyBindings({'command': 'keymap-display:toggle'})[0].keystrokes
    const groupsCommand = window.atom.keymaps.findKeyBindings({'command': 'keymap-display:change-groups'})[0].keystrokes
    mainHeading.textContent = 'Keymap Display (' + toggleCommand + ' to close this panel) (' + groupsCommand + ' to switch groups)'
    content.appendChild(mainHeading)

    // Add search.
    const searchInput = document.createElement('atom-text-editor')
    searchInput.setAttribute('mini', true)
    searchInput.setAttribute('data-encoding', 'utf8')
    searchInput.setAttribute('data-grammar', 'text plain null-grammar')
    searchInput.className = 'search-input'
    content.appendChild(searchInput)

    // Create buttons to toggle shortcut groups.
    const groupToggle = document.createElement('div')
    groupToggle.classList.add('group-buttons')
    const groupButtonList = document.createElement('ul')

    // const importantItem = document.createElement('li')
    // importantItem.textContent = 'Important'
    const allItem = document.createElement('li')
    allItem.textContent = 'All'
    const treeItem = document.createElement('li')
    treeItem.textContent = 'Tree View'
    const packagesItem = document.createElement('li')
    packagesItem.textContent = 'Packages'
    const customItem = document.createElement('li')
    customItem.textContent = 'Custom'
    customItem.className = 'selected'
    // groupButtonList.appendChild(importantItem)
    groupButtonList.appendChild(allItem)
    groupButtonList.appendChild(treeItem)
    groupButtonList.appendChild(packagesItem)
    groupButtonList.appendChild(customItem)
    groupToggle.appendChild(groupButtonList)
    content.appendChild(groupToggle)

    const keyBindings = window.atom.keymaps.getKeyBindings()
    // console.log(keyBindings)
    const userConfigPath = window.atom.config.getUserConfigPath()
    // console.log('userConfigPath: ' + userConfigPath)
    const atomFolderPath = userConfigPath.substring(0, userConfigPath.indexOf('config.cson'))
    // console.log('atomFolderPath: ' + atomFolderPath)

    // Create the keymaps list to hold keyboard shortcuts.
    const keymapsList = document.createElement('ul')
    keymapsList.className = 'keymap-list'

    // Create keyboard shortcuts list items for custom keys.
    const customKeysPath = atomFolderPath + 'keymap.cson'
    keyBindings.forEach(function (keyBinding, index, array) {
      if (keyBinding.source === customKeysPath) {
        const customKeymapsItem = document.createElement('li')
        const customKeymapsItemContainer = document.createElement('div')
        customKeymapsItem.className = 'custom-keys'
        customKeymapsItem.setAttribute('data-show-key', 'yes')
        const command = document.createElement('span')
        command.textContent = keyBinding.command
        const keystrokes = document.createElement('span')
        keystrokes.textContent = keyBinding.keystrokes
        customKeymapsItemContainer.appendChild(command)
        customKeymapsItemContainer.appendChild(keystrokes)
        customKeymapsItem.appendChild(customKeymapsItemContainer)
        keymapsList.appendChild(customKeymapsItem)
      }
    })

    // Create keyboard shortcuts list items for packages keys.
    const packagesKeysPath = atomFolderPath + 'packages'
    keyBindings.forEach(function (keyBinding, index, array) {
      if (keyBinding.source.indexOf(packagesKeysPath) !== -1) {
        const packagesKeymapsItem = document.createElement('li')
        const packagesKeymapsItemContainer = document.createElement('div')
        packagesKeymapsItem.className = 'packages-keys'
        packagesKeymapsItem.setAttribute('data-show-key', 'no')
        const command = document.createElement('span')
        command.textContent = keyBinding.command
        const keystrokes = document.createElement('span')
        keystrokes.textContent = keyBinding.keystrokes
        packagesKeymapsItemContainer.appendChild(command)
        packagesKeymapsItemContainer.appendChild(keystrokes)
        packagesKeymapsItem.appendChild(packagesKeymapsItemContainer)
        keymapsList.appendChild(packagesKeymapsItem)
      }
    })

    // Create keyboard shortcuts list items for tree view keys.
    const treeKeysPath = 'tree-view.json'
    keyBindings.forEach(function (keyBinding, index, array) {
      if (keyBinding.source.indexOf(treeKeysPath) !== -1) {
        const treeKeymapsItem = document.createElement('li')
        const treeKeymapsItemContainer = document.createElement('div')
        treeKeymapsItem.className = 'tree-keys'
        treeKeymapsItem.setAttribute('data-show-key', 'no')
        const command = document.createElement('span')
        command.textContent = keyBinding.command
        const keystrokes = document.createElement('span')
        keystrokes.textContent = keyBinding.keystrokes
        treeKeymapsItemContainer.appendChild(command)
        treeKeymapsItemContainer.appendChild(keystrokes)
        treeKeymapsItem.appendChild(treeKeymapsItemContainer)
        keymapsList.appendChild(treeKeymapsItem)
      }
    })

    // Create keyboard shortcuts list items for all keys.
    keyBindings.forEach(function (keyBinding, index, array) {
      const allKeymapsItem = document.createElement('li')
      const allKeymapsItemContainer = document.createElement('div')
      allKeymapsItem.className = 'all-keys'
      allKeymapsItem.setAttribute('data-show-key', 'no')
      const command = document.createElement('span')
      command.textContent = keyBinding.command
      const keystrokes = document.createElement('span')
      keystrokes.textContent = keyBinding.keystrokes
      allKeymapsItemContainer.appendChild(command)
      allKeymapsItemContainer.appendChild(keystrokes)
      allKeymapsItem.appendChild(allKeymapsItemContainer)
      keymapsList.appendChild(allKeymapsItem)
    })

    // Add keys list.
    content.appendChild(keymapsList)
    this.element.appendChild(content)
  }

  // Returns an object that can be retrieved when package is activated
  serialize () {}

  // Tear down any state and detach
  destroy () {
    this.element.remove()
  }

  getElement () {
    return this.element
  }
}
