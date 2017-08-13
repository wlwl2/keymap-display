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
      'keymap-display:toggle': () => this.toggle()
    }))

    // window.atom.workspace.observeTextEditors((editor) => {
    //   var editorView
    //   var keypressHandler
    //   editorView = window.atom.views.getView(editor)
    //   keypressHandler = (event) => {
    //     this.modalPanel.hide()
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

  toggle () {
    return (
      this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show()
      // this.modalPanel.show()
    )
  }
}
