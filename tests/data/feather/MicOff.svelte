<script lang="ts">
  let {
    width = "24",
    height = "24",
    fill = "none",
    stroke = "currentColor",
    "stroke-linecap": strokeLinecap = "round",
    "stroke-linejoin": strokeLinejoin = "round",
    "stroke-width": strokeWidth = "2",
    viewBox = "0 0 24 24",
    ...rest
  } = $props();
</script>

<svg
  {width}
  {height}
  {fill}
  {stroke}
  stroke-linecap={strokeLinecap}
  stroke-linejoin={strokeLinejoin}
  stroke-width={strokeWidth}
  {viewBox}
  {...rest}
>
  <path d="M1 1 23 23M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19 12 23M8 23 16 23" />
</svg>
