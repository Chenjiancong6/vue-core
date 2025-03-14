<script lang="ts">
import { h } from "vue";

export default {
  provide: function () {
    return {
      map: this.$parent.map,
      baseMap: this.$parent
    };
  },
  props: {
    slots: {
      type: [Array, Object],
      default: function () {
        return [];
      },
    },
  },
  render() {
    if (!this.slots.default) {
      return [];
    }
    return h(
      "div",
      {
        class: "bs-amap-layers",
        style: "display: none",
      },
      [this.slots.default()]
    );
  },
};
</script>
