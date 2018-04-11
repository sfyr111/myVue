import Vue from './mvvm/mvvm'

let vm = new Vue({
  el: '#app',
  data: {
    testA: 'i am testA',
    testB: 'i am testB',
  },
})

vm._data.testA = 'testA change'
vm._data.testB = 'testB change'