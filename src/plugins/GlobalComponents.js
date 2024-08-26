import ContentsFrameComp from "@/views/ContentsFrameComp.vue"

import NavComp from "@/components/NavComp.vue"
import TitleComp from "@/components/TitleComp.vue"

import TableComp from "@/components/DetailComponents/TableComp.vue"
import MultiTdTableComp from "@/components/DetailComponents/MultiTdTableComp.vue"
import ProgressTableComp from "@/components/DetailComponents/ProgressTableComp.vue"
import PaginationComp from "@/components/DetailComponents/PaginationComp.vue"
import TabComp from "@/components/DetailComponents/TabComp.vue"
import SignaturePad from "@/components/DetailComponents/SignaturePad.vue"
import InnerMultiTdTableComp from "@/components/DetailComponents/InnerMultiTdTableComp.vue"
import ModalCaseOneComp from "@/components/DetailComponents/ModalCaseOneComp.vue"
import ModalCaseTwoComp from "@/components/DetailComponents/ModalCaseTwoComp.vue"
import ModalCaseThreeComp from "@/components/DetailComponents/ModalCaseThreeComp.vue"
import ModalCaseFourComp from "@/components/DetailComponents/ModalCaseFourComp.vue"
import ModalCaseFiveComp from "@/components/DetailComponents/ModalCaseFiveComp.vue"
import ModalCaseSixComp from "@/components/DetailComponents/NewPopup.vue"

const GlobalComponentsPlugin = {
  install(app) {
    app.component("ContentsFrameComp", ContentsFrameComp)

    app.component("NavComp", NavComp)
    app.component("TitleComp", TitleComp)

    app.component("TableComp", TableComp)
    app.component("MultiTdTableComp", MultiTdTableComp)
    app.component("ProgressTableComp", ProgressTableComp)
    app.component("PaginationComp", PaginationComp)
    app.component("TabComp", TabComp)
    app.component("SignaturePad", SignaturePad)
    app.component("InnerMultiTdTableComp", InnerMultiTdTableComp)
    app.component("ModalCaseOneComp", ModalCaseOneComp)
    app.component("ModalCaseTwoComp", ModalCaseTwoComp)
    app.component("ModalCaseThreeComp", ModalCaseThreeComp)
    app.component("ModalCaseFourComp", ModalCaseFourComp)
    app.component("ModalCaseFiveComp", ModalCaseFiveComp)
    app.component("ModalCaseSixComp", ModalCaseSixComp)
  }
};

export default GlobalComponentsPlugin;