<template>
    <div>
        <header>
            <slot name="header">
                Another Custom Layout header content
            </slot>
        </header>
        <main>
            <slot name="content"/>
        </main>
    </div>
</template>