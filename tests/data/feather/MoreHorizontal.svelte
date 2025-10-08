<script lang="ts">
  let {
    width = "24",
    height = "24",
    fill = "none",
    stroke = "currentColor",
    "stroke-linecap": strokeLinecap = "round",
    "stroke-linejoin": strokeLinejoin = "round",
    "stroke-width": strokeWidth = "2",
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
  viewBox="0 0 24 24"
  {...rest}
>
  <circle cx="12" cy="12" r="1" />
  <circle cx="19" cy="12" r="1" />
  <circle cx="5" cy="12" r="1" />
</svg>
