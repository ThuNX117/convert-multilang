<template>
    <n-loading-bar-provider>
        <n-message-provider>
            <n-config-provider>
                <n-global-style />
                <header>
                    <router-link to="/">Translation management</router-link>
                    <router-link to="/tester">for tester </router-link>
                    <router-link to="/frontend-dev">for frontend developer</router-link>
                    <router-link to="/backend-dev">for backend developer</router-link>
                </header>
                <main style="min-width: 100vw;">
                    <router-view />
                </main>
            </n-config-provider>
        </n-message-provider>
    </n-loading-bar-provider>

</template>
<script lang="ts" setup>

</script>
<style scoped lang="scss">
header {
    background-color: #26729f;
    padding: 2px;
    color: white;
    text-align: center;

    a {
        color: white;
        text-decoration: none;
        margin: 0 10px;

    }

}

main {
    padding: 0;
    margin: 0;
    height: calc(100vh - 40px);
}
</style>