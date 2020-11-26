<template>
  <svg
    class="FreeleticsLogo"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    :fill="fillColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10.3792 0L24.389 3.89344L28 17.8955L17.6009 28L6.28572 24.8539V3.97894L10.3792 0ZM0 10.1675L5.14286 5.14286V24.5714L3.59973 24.1402L0 10.1675Z"
    />
  </svg>
</template>

<script>
export default {
  props: ["fillColor"]
};
</script>

<style>
.FreeleticsLogo {
  height: 32px;
  width: 32px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
