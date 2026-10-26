<template>
    <div class="fixed h-full w-full">
        <NuxtRouteAnnouncer />
        <NuxtPage :key="$route.fullPath" />
    </div>
</template>