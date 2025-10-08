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
  <path d="M22 12 18 12 15 21 9 3 6 12 2 12" />
</svg>
