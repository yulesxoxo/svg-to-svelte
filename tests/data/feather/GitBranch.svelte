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
  <path d="M6 3 6 15" />
  <path d="M18 9a9 9 0 0 1-9 9" />
  <circle cx="18" cy="6" r="3" />
  <circle cx="6" cy="18" r="3" />
</svg>
