<script lang="ts">
  let {
    width = "200",
    height = "200",
    ...rest
  } = $props();
</script>

<svg
  {width}
  {height}
  {...rest}
>
  <path fill="#00f" d="M10 10H110V110H10z" />
  <path fill="red" d="M20 20H70V70H20z" />
</svg>
