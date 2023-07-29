<template>
    <div>
        <header>
            <slot name="header">
                Custom Layout header content
            </slot>
        </header>
        <main>
            <slot />
        </main>
    </div>
</template>