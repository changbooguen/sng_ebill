import '@mdi/font/css/materialdesignicons.css'
import 'font-awesome/css/font-awesome.min.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases as faAliases, fa } from 'vuetify/iconsets/fa'
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi'
import { aliases as mdiSvgAliases, mdi as mdiSvg } from 'vuetify/iconsets/mdi-svg'
import { VCalendar } from 'vuetify/labs/VCalendar'

const aliases = {
    ...mdiAliases,
    ...faAliases,
    ...mdiSvgAliases,
}

const allComponents = {
    ...components,
    VCalendar,
}

export default createVuetify({
    components: allComponents,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            fa,
            mdi,
            mdiSvg,
        },
    },
})