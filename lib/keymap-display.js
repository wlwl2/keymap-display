'use babel'

import KeymapDisplayView from './keymap-display-view'
import { CompositeDisposable } from 'atom'

export default {

  keymapDisplayView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.keymapDisplayView = new KeymapDisplayView(state.keymapDisplayViewState)
    this.modalPanel = window.atom.workspace.addModalPanel({
      item: this.keymapDisplayView.getElement(),
      visible: false
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(window.atom.commands.add('atom-workspace', {
      'keymap-display:toggle': () => this.toggle(),
      'keymap-display:change-groups': () => this.changeGroups()
    }))

    // window.atom.workspace.observeTextEditors((editor) => {
    //   var editorView
    //   var keypressHandler
    //   editorView = window.atom.views.getView(editor)
    //   keypressHandler = (event) => {
    //     // this.modalPanel.hide()
    //   }
    //   return editorView.addEventListener('keyup', keypressHandler)
    // })
  },

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.keymapDisplayView.destroy()
  },

  serialize () {
    return {
      keymapDisplayViewState: this.keymapDisplayView.serialize()
    }
  },

  changeGroups () {
    function hideAllItems () {
      var contentItems = document.querySelectorAll('.atom-keymap-display-package .content > ul > li')
      for (var i = 1; i < contentItems.length; i++) {
        contentItems[i].setAttribute('style', 'display: none;')
      }
    }

    // show group
    function showGroup (selectedGroup) {
      if (selectedGroup.textContent === 'Tree View') {
        hideAllItems()
        var treeKeys = document.querySelectorAll('.tree-keys')
        treeKeys.forEach(function (treeKey, index) {
          treeKey.setAttribute('style', 'display: table-row;')
        })
      } else if (selectedGroup.textContent === 'Packages') {
        hideAllItems()
        var packagesKeys = document.querySelectorAll('.packages-keys')
        packagesKeys.forEach(function (packagesKey, index) {
          packagesKey.setAttribute('style', 'display: table-row;')
        })
      } else if (selectedGroup.textContent === 'Custom') {
        hideAllItems()
        var customKeys = document.querySelectorAll('.custom-keys')
        customKeys.forEach(function (customKey, index) {
          customKey.setAttribute('style', 'display: table-row;')
        })
      }
    }

    if (this.modalPanel.visible === true) {
      // shifts between buttons.
      var selectedGroup = document.querySelector('.group-buttons ul li.selected')
      var firstGroup = document.querySelectorAll('.group-buttons ul li')[0]
      selectedGroup.className = ''
      if (selectedGroup.nextElementSibling) {
        selectedGroup.nextElementSibling.className = 'selected'
        showGroup(selectedGroup.nextElementSibling)
      } else {
        firstGroup.className = 'selected'
        showGroup(firstGroup)
      }
    }
  },

  toggle () {
    document.querySelector('.atom-keymap-display-package').style.maxHeight =
    String(window.atom.getSize().height - 200) + 'px'
    window.addEventListener('resize', function (event) {
      document.querySelector('.atom-keymap-display-package').style.maxHeight =
      String(window.atom.getSize().height - 200) + 'px'
    }, false)
    return (
      this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show()
      // this.modalPanel.show()
    )
  }
}
