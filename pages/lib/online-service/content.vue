<template name="online_service">
  <button open-type="contact" class="common-quick-nav common-online-service" :send-message-title="title || ''" :send-message-path="path || ''" :send-message-img="img || ''" :show-message-card="card || false">
    <image src="/static/images/online-service-icon.png" class="dis-block"></image>
  </button>
</template>
	<script>
		
		export default {
			props: []
		}
    </script>
									