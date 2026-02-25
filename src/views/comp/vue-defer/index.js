
import { defineComponent, h, onUnmounted, ref, watch } from "vue";

function useIntersectionObserver(target, options) {
	const isVisible = ref(false);
	const observer = new IntersectionObserver(([entry]) => {
		isVisible.value = entry.isIntersecting;
	}, options);
	watch(target, (el, _, onCleanup) => {
		if (!el) return;
    // console.log(el,'target',target.value);
		observer.observe(el);
    // 当以下情况发生时会被调用:
    //1. watch 被停止
    //2. watch 依赖的值发生变化，即将执行新的回调之前
		onCleanup(() => {
      // console.log('触发清除函数',el);
      observer.unobserve(el)
    });
	}, { immediate: true });
	function stop() {
		observer.disconnect();
	}
	onUnmounted(stop);
	return {
		isVisible,
		stop
	};
}

const LazyRender = defineComponent({
	name: "LazyRender",
	props: {
		root: {
			type: Object,
			default: null
		},
		tag: {
			type: String,
			default: "div"
		},
		rootMargin: {
			type: String,
			default: void 0
		},
		threshold: {
			type: [Number, Array],
			default: void 0
		}
	},
	emits: ["change"],
	setup(props, { slots, emit }) {
		const containerRef = ref(null);
		const { isVisible, stop } = useIntersectionObserver(containerRef, {
			root: props.root,
			rootMargin: props.rootMargin,
			threshold: props.threshold
		});
		let render;
		let currentVNode = null;
		let called = false;
		const stopWatch = watch(isVisible, (visible) => {
			if (currentVNode) {
				const component = currentVNode.component;
				containerRef.value = currentVNode.el;
				if (component) if (!visible) {
					const _render = component.render;
					component.render = () => {
						called = true;
						return component.subTree;
					};
					render = _render;
				} else {
					component.render = render || component.render;
					if (called) component.update();
				}
				else cleanup();
				emit("change", visible);
			}
		}, { flush: "post" });
		function cleanup() {
			stop();
			stopWatch();
		}
		return () => {
			if (!isVisible.value && !currentVNode) {
        return h(props.tag, { ref: containerRef }, slots.fallback?.())
      };
			const vnode = slots.default?.();
			currentVNode = vnode[0];
			return vnode;
		};
	}
});

//#endregion
export { LazyRender };