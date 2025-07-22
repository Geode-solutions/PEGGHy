export const useCounterStore = defineStore("basic", () => {
  const name = ref("basic");
  function log() {
    console.log(name.value);
  }

  return { name, log };
});
