<template>
    <div>
        <header>
            <slot name="header">
                Default layout
            </slot>
        </header>
        <slot name="content" />
    </div>
</template>