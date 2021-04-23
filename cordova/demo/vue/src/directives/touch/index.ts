/**
 * 处理 移动设备上的 点击、长按、左右上下滑动 事件
 *
 * =========================================
 * 导出了7个自定义指令：
 *  v-tap： tap点击事件
 *  v-swipe： swipe滑动事件
 *  v-swipeleft： swipeleft左滑事件
 *  v-swiperight： swiperight右滑事件
 *  v-swipedown： swipedown下滑
 *  v-swipeup： swipeup上滑
 *  v-longtap： longtap长按
 * =========================================
 *
 * =========================================
 * 包含四个参数
 * stop 阻止冒泡
 * prevent 阻止默认事件
 * self 只当在 event.target 是当前元素自身时触发处理函数
 * once 执行一次后解绑
 *
 * @example v-tap.stop.prevent.self.once
 * =========================================
 *
 * =========================================
 * 事件绑定有两种方式
 * @example
 *  1. v-tap="showDialog" 绑定一个方法对象
 *  2. v-tap="{fn:click123, param1:1, param2:2, param3:{aaa:'123'} ...}"
 *      绑定一个JSON字面量，fn是执行的方法，后边的是需要传递的参数
 * 事件回调参数
 * @param 第一个参数是event，事件对象
 * @param 第二个参数是 binding.value，也就是v-tap=""双引号中的部分（如示例2，第二个参数就是 {fn:click123, param1:1, param2:2, param3:{aaa:'123'} ...}）
 * =========================================
 *
 */

import { DirectiveBinding } from "vue";
import { App } from "vue";
interface Pos {
  x: number;
  y: number;
}

/**
 * vue上点击事件处理类
 */
class VueTouch {
  /**
   * @param el: Event
   * @param binding: function | string
   * @param type: string
   */
  constructor(el: HTMLElement, binding: DirectiveBinding, type: string) {
    let g = this;
    this.obj = el;
    this.binding = binding;
    this.touchType = type;

    this.firstTouchPosition = { x: 0, y: 0 };
    this.firstTouchTime = 0;
    this.callBack =
      typeof binding.value === "object" ? binding.value.fn : binding.value;

    this.moved = false;
    this.leaved = false;
    this.longTouched = false;

    // 事件监听回调集合
    let _listener = Object.create(null);

    // 事件方法
    let _listen = (type: string) => {
      return function (e: TouchEvent) {
        let { stop, prevent, self, once } = g.binding.modifiers;

        // 配置判断
        if (stop) e.stopPropagation();
        if (prevent) e.preventDefault();
        if (once) g.obj.removeEventListener("touch" + type, _listener[type]);
        if (self && e.target !== e.currentTarget) return;

        (g as any)[type](e);
      };
    };

    _listener.start = _listen("start");
    _listener.end = _listen("end");
    _listener.move = _listen("move");

    this.obj.addEventListener("touchstart", _listener.start, false);
    this.obj.addEventListener("touchend", _listener.end, false);
    this.obj.addEventListener("touchmove", _listener.move, false);
  }
  private obj: HTMLElement;
  private touchType: string;
  private firstTouchPosition: Pos;
  private firstTouchTime: number;
  private moved: boolean;
  private leaved: boolean;
  private longTouched: boolean;
  private time: any;
  private binding: DirectiveBinding;
  private callBack: any;

  start(e: TouchEvent) {
    let g = this;
    this.binding.modifiers.prevent = true;

    // 初始化点击状态
    this.moved = false;
    this.leaved = false;
    this.longTouched = false;

    this.firstTouchPosition = this.getMultiCenter(e.changedTouches);
    this.firstTouchTime = e.timeStamp;
    this.time = setTimeout(
      function () {
        if (!g.leaved && !g.moved) {
          g.touchType === "longtap" && g.callBack(e, g.binding.value);
          g.longTouched = true;
        }
      }.bind(g),
      350
    );
  }

  end(e: TouchEvent) {
    let g = this;

    let { x, y } = g.getMultiCenter(e.changedTouches);
    let _disX = x - g.firstTouchPosition.x;
    let _disY = y - g.firstTouchPosition.y;
    let _dis = Math.sqrt(_disX * _disX + _disY * _disY);
    let _timeDis = e.timeStamp - g.firstTouchTime;

    clearTimeout(g.time);

    let _angle = this.getAngle(_disX, _disY);

    if (_dis > 18 && _timeDis < 300) {
      g.touchType === "swipe" && g.callBack(e, g.binding.value);
      if (_angle >= 60 && _angle <= 120)
        g.touchType === "swipedown" && g.callBack(e, g.binding.value);
      if (_angle <= -60 && _angle >= -120)
        g.touchType === "swipeup" && g.callBack(e, g.binding.value);
      if (_angle <= 20 && _angle >= -20)
        g.touchType === "swipeleft" && g.callBack(e, g.binding.value);
      if ((_angle <= -160 && _angle > -180) || (_angle >= 160 && _angle <= 180))
        g.touchType === "swiperight" && g.callBack(e, g.binding.value);
    } else {
      if (!g.longTouched && !g.moved) {
        console.log("tap");
        g.touchType === "tap" && g.callBack(e, g.binding.value);
        g.leaved = true;
      }
      if (g.longTouched && (_dis < 50 || !g.moved)) {
        g.touchType === "longtapEnd" && g.callBack(e, g.binding.value);
        g.longTouched = false;
        g.leaved = false;
      } else if (g.longTouched && g.moved) {
        g.touchType === "longtapCancel" && g.callBack(e, g.binding.value);
        g.longTouched = false;
        g.leaved = true;
      }
    }
  }

  move() {
    this.moved = true;
  }

  /**
   * 获取点击集合的中心坐标
   * @param touches touch对象集合
   * @return {{x: number, y: number}}
   */
  getMultiCenter(touches: TouchList) {
    let x = 0,
      y = 0;

    const _length = touches.length;

    for (let i = 0; i < _length; i++) {
      x += touches[i].pageX;
      y += touches[i].pageY;
    }

    return {
      x: Math.round(x / _length),
      y: Math.round(y / _length),
    };
  }

  getAngle(disX: number, disY: number) {
    if (typeof disX !== "number" || typeof disY !== "number") return 45;

    return (Math.atan2(disY, disX) * 180) / Math.PI;
  }
}

function selfDirective(app: App) {
  app.directive("tap", {
    // 在绑定元素的 attribute 或事件监听器被应用之前调用
    // created() {},
    // 在绑定元素的父组件挂载之前调用
    // beforeMount() {},
    // 绑定元素的父组件被挂载时调用
    mounted(el, binding) {
      new VueTouch(el, binding, "tap");
    },
    // 在包含组件的 VNode 更新之前调用
    // beforeUpdate() {},
    // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
    // updated() {},
    // 在绑定元素的父组件卸载之前调用
    // beforeUnmount() {},
    // 卸载绑定元素的父组件时调用
    // unmounted() {},
  });
  app.directive("swipe", {
    mounted(el, binding) {
      new VueTouch(el, binding, "swipe");
    },
  });
  app.directive("swipeleft", {
    mounted(el, binding) {
      new VueTouch(el, binding, "swipeleft");
    },
  });
  app.directive("swipedown", {
    mounted(el, binding) {
      new VueTouch(el, binding, "swipedown");
    },
  });
  app.directive("swipeup", {
    mounted(el, binding) {
      new VueTouch(el, binding, "swipeup");
    },
  });
  app.directive("longtap", {
    mounted(el, binding) {
      new VueTouch(el, binding, "longtap");
    },
  });
  app.directive("longtapEnd", {
    mounted(el, binding) {
      new VueTouch(el, binding, "longtapEnd");
    },
  });
  app.directive("longtapCancel", {
    mounted(el, binding) {
      new VueTouch(el, binding, "longtapCancel");
    },
  });
}

export default {
  install: selfDirective,
};
