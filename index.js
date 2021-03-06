import Vue from './mvvm/mvvm'

var vm = new Vue({
  el: '#vue-app',
  data: {
    word: 'Hello World!',
    obj: {
      a: 1
    }
  },

  methods: {
    sayHi() {
      this.word = 'Hi, everybody!';
    },
    add() {
      this.obj.a += 1
    }
  },

  mounted() {
    console.log('mounted')
  },

  computed: {
    cWord() {
      return this.word + Date.now()
    },
    cObjA: {
      get() {
        return this.obj.a + Date.now()
      }
    }
  }
})

vm.$watch('obj.a', (...args) => {
  console.log(args)
})