import Vue from './vue'


var test = {
  a: 1,
  b: 2
}

var vm = new Vue({
  data: test
})

test.a = 3