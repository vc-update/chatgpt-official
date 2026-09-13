<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const { frontmatter } = useData()
const route = useRoute()

const isGuide = computed(() => route.path.startsWith('/guides/'))
const verifiedDate = computed(() => {
  const value = frontmatter.value.updated || frontmatter.value.lastUpdated || frontmatter.value.date
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai'
  }).format(date)
})
const publishedDate = computed(() => {
  const value = frontmatter.value.date
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai'
  }).format(date)
})
const officialSource = computed(() => {
  const sources = frontmatter.value.sources
  return Array.isArray(sources) && typeof sources[0] === 'string' ? sources[0] : ''
})
</script>

<template>
  <aside v-if="isGuide" class="article-meta" aria-label="文章编辑信息">
    <span>作者：<a href="/about">ChatGPT 独立指南编辑部</a></span>
    <span v-if="publishedDate">首次发布：{{ publishedDate }}</span>
    <span v-if="verifiedDate">最后核验：{{ verifiedDate }}</span>
    <span>核验方法：官方资料、页面对照与可复现步骤</span>
    <span v-if="officialSource">主要来源：<a :href="officialSource" target="_blank" rel="noopener noreferrer">官方页面</a></span>
    <a href="/editorial-policy">编辑与内容政策</a>
  </aside>
</template>
