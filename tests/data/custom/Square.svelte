<script lang="ts">
  let {
    "aria-label": ariaLabel = "Blue Square",
    "aria-description": ariaDescription = "A simple blue square with 100 by 100 pixels dimensions.",
    width = "100",
    height = "100",
    ...rest
  } = $props();
</script>

<svg
  aria-label={ariaLabel}
  aria-description={ariaDescription}
  {width}
  {height}
  {...rest}
>
  <path fill="#00f" d="M0 0H100V100H0z" />
</svg>
