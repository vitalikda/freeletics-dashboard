<template>
  <v-app>
    <v-app-bar dark clipped-left app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <span class="title ml-3 mr-5 py-0">
        <v-avatar class="mr-2" size="32">
          <logo fill="white" />
        </v-avatar>
        Freeletics
      </span>
      <v-spacer></v-spacer>
      <v-btn @click.stop="switchTheme" class="mx-1" icon>
        <v-icon v-if="$vuetify.theme.dark">mdi-weather-night</v-icon>
        <v-icon v-else>mdi-white-balance-sunny</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped color="grey lighten-4">
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-divider v-if="item.divider" :key="i" class="my-4" dark></v-divider>
          <v-list-item v-else :href="item.link" :key="i" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo
  },
  data() {
    return {
      drawer: null,
      items: [
        { icon: "mdi-view-dashboard", text: "Dashboard", link: "/" },
        { icon: "mdi-file-image", text: "Demo Page", link: "/demo" },
        { divider: true },
        {
          icon: "mdi-github",
          text: "Source",
          link: "https://github.com/vitalikda/freeletics-dashboard"
        },
        {
          icon: "mdi-help-circle",
          text: "Help",
          link: "https://github.com/vitalikda/freeletics-dashboard/issues"
        }
      ]
    };
  },
  methods: {
    switchTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
};
</script>

<style scoped>
.v-navigation-drawer__border {
  display: none;
}
</style>
