<template>
  <div id="app">
    <LayoutPreloader />
    <div id="app-content">
      <LayoutHeader />
      <main id="main-content">
        <slot />
      </main>
      <LayoutFooter />
    </div>
  </div>
</template>
