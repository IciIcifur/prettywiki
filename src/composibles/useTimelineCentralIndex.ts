import { onMounted, onUnmounted, ref, watch } from 'vue';

export function useTimelineCenterIndex(scrollRef: {
  value: HTMLElement | null;
}) {
  const centerIndex = ref(0);

  function updateCenterIndex() {
    const container = scrollRef.value;
    if (!container) return;

    const children = Array.from(
      container.children[0].children
    ) as HTMLElement[];
    if (!children.length) return;

    const items = children.filter(
      (el) => el.textContent && el.textContent.trim().length > 0
    );
    if (!items.length) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + (containerRect.width * 2) / 3;

    let minDist = Infinity;
    let idx = 0;

    items.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const iconCenter = rect.left + rect.width / 2;
      const dist = Math.abs(iconCenter - containerCenter);
      if (dist < minDist) {
        minDist = dist;
        idx = i;
      }
    });

    centerIndex.value = idx;
  }

  onMounted(() => {
    scrollRef.value?.addEventListener('scroll', updateCenterIndex);
    window.addEventListener('resize', updateCenterIndex);
    setTimeout(updateCenterIndex, 400);
  });

  onUnmounted(() => {
    scrollRef.value?.removeEventListener('scroll', updateCenterIndex);
    window.removeEventListener('resize', updateCenterIndex);
  });

  watch(scrollRef, () => {
    updateCenterIndex();
  });

  return centerIndex;
}
