<template>
  <header class="site-header">
    <nav class="navbar" aria-label="主导航">
      <NuxtLink to="/" class="header-brand" aria-label="MICROPUE Tools 首页">
        <span class="brand-name">MICROPUE</span>
        <span class="brand-product-clip">
          <span class="brand-product">Tools</span>
        </span>
      </NuxtLink>

      <div class="nav-actions">
        <Button as="a" class="github-link" severity="secondary" rounded :href="githubUrl" target="_blank"
          rel="noopener noreferrer" aria-label="GitHub">
          <i class="pi pi-github" aria-hidden="true" />
          <span>GitHub</span>
        </Button>
      </div>
    </nav>
  </header>

  <main>
    <slot />
  </main>
</template>

<script setup lang="ts">
const githubUrl = 'https://github.com/Micropue'
</script>

<style lang="scss" scoped>
.site-header {
  // 显式抬升，避免后续固定定位元素盖住导航
  position: relative;
  z-index: 2;

  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    text-decoration: none;
  }

  .navbar {
    width: 90%;
    max-width: 1300px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-brand {
    flex: none;
    display: flex;
    align-items: center;
    white-space: nowrap;
    color: inherit;
    font-size: 2.4em;
  }

  .brand-product {
    display: inline-block;
    font-family: 'Dancing Script';
  }

  .brand-product-clip {
    display: inline-block;
    margin-left: 0.5em;
    clip-path: inset(-0.5em -0.5em -0.5em 0);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .github-link {
    display: flex;
    align-items: center;
    width: fit-content;
    min-height: 36px;
    white-space: nowrap;
    font-size: 1em;

    .pi {
      font-size: 1.5em;
    }
  }

  @media screen and (max-width: 700px) {
    .header-brand {
      font-size: 1.8em;

      .brand-name {
        display: none;
      }
    }
  }

  @media screen and (max-width: 360px) {
    .header-brand {
      font-size: 1.5em;
    }
  }
}
</style>
