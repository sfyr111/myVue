import Vue from './mvvm/mvvm'

let vm = new Vue({
  el: '#app',
  data: {
    testA: 'i am testA'
  },
  methods: {
    change() {
      this.testA = 'testA is change'
    }
  }
})