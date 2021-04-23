<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    const router = useRouter()
    const goToHome = () => router.push('Home')
    return { goToHome }
  },
})
</script>
