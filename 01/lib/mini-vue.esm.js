import { createElementBlock, openBlock, createTextVNode, createElementVNode } from 'vue';

var script = {
  setup(){
    return {
    
    }
  }
};

const _hoisted_1 = { key: 0 };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", null, [
    _cache[1] || (_cache[1] = createTextVNode(" app ")),
    (openBlock(), createElementBlock("div", _hoisted_1, "true"))
      ,
    createElementVNode("div", {
      onClick: _cache[0] || (_cache[0] = ()=>console.log('ok'))
    }, "ok")
  ]))
}

script.render = render;
script.__file = "App.vue";

export { script as default };
