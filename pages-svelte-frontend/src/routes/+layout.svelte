<script>
	import '../app.postcss';
</script>

<nav>
	<a href="/">Home</a>
	<a href="/fetch">Reload</a>
	<button class="btn" on:click={() => window.location.reload()}>Hello daisyUI</button>

</nav>
<slot />
