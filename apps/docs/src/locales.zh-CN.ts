export default {
  layout: {
    skipToContent: '跳到内容',
    sidebarAria: 'HYN 组件文档导航',
    brandTitle: '组件图谱',
    brandSubtitle: 'Sage Glass 开发者文档',
    overviewTitle: '总览',
    overviewCaption: '选型、规则、验收',
    tocAria: '当前文档目录',
    tocTitle: '本页目录',
    fallbackSection: '章节 {index}'
  },
  catalog: {
    title: {
      i18nBoundary: '多语言边界',
      globalConfig: '全局配置',
      table: 'HynTable',
      form: 'HynForm',
      treeSelect: 'HynTreeSelect',
      deptSelect: 'HynDeptSelect',
      dialog: 'HynDialog',
      cronExpression: 'HynCronExpression',
      tableDialog: 'HynTableDialog',
      virtualTable: 'HynVirtualTable',
      virtualTreeTable: 'HynVirtualTreeTable',
      entityPicker: 'HynRemoteSelect / HynEntityPicker'
    },
    category: {
      guide: '指南',
      dataDisplay: '数据展示',
      dataEntry: '数据录入',
      feedback: '反馈'
    },
    caption: {
      i18nBoundary: 'AI 编码时的文本归属、后端契约和审计判断',
      globalConfig: 'HYN 公共行为默认值、局部覆盖和维护规则',
      table: '普通分页 CRUD 默认表格，统一列配置、tooltip 和操作列',
      form: '项目标准表单协议，统一 label、字段栅格、控件宽度和内部对齐',
      treeSelect: '通用树选择字段，支持层级树、虚拟平铺、本地搜索和父子独立选择',
      deptSelect: '用于 HynForm 和 HynDialog 字段的部门选择器，支持单选、多选和虚拟平铺模式',
      dialog: '普通新增、编辑、详情弹窗默认入口，底层复用 el-dialog',
      cronExpression: 'Quartz Cron 表达式字段组件，表单内轻量输入，生成器和解析库按需加载',
      tableDialog: '筛选、批量操作、表格和分页组成的日志、审计或授权弹窗',
      virtualTable: '大数据平铺列表、授权弹窗、日志和审计表',
      virtualTreeTable: '部门、组织、区域、分类、权限等大树默认方案',
      entityPicker: '表单内远程实体选择和弹窗表格跨页选择'
    },
    status: {
      stable: '稳定',
      preview: '预览',
      planned: '规划'
    }
  },
  globalConfig: {
    hero: {
      kicker: 'HYN 全局配置',
      title: '全局配置',
      description: 'HYN 公共行为默认值集中在一个入口里维护。总览只保留选型和导航，这类完整协议必须进入独立菜单页。',
      pills: {
        singleEntry: '单一配置入口',
        localOverride: '局部显式覆盖',
        docsRequired: '新增配置必须补文档'
      }
    },
    reference: {
      kicker: '配置表',
      title: '当前支持项',
      description:
        'HYN 自有配置入口是 `src/components/Hyn/config.ts`。根组件通过 `provideHynGlobalConfig(hynGlobalConfig)` 注入，不放进 Pinia，也不混入 Element Plus ConfigProvider。',
      aria: 'HYN 全局配置说明',
      columns: {
        name: '配置',
        defaultValue: '默认值',
        description: '说明'
      },
      rows: {
        typeSource:
          '三态协议类型定义在 src/components/Hyn/shared/overflow.ts。它只限制可选值，不提供运行时默认值；全局配置、表格列、表单 label 和弹窗 label 都复用这个类型。',
        overflowMode:
          '运行时默认值来自 src/components/Hyn/config.ts 的 hynGlobalConfig.overflowMode，当前为 fit；它控制 HynTable、HynVirtualTable、HynVirtualTreeTable、HynForm label 和 HynDialog label 的默认文本溢出策略。',
        overflowModeOverride: '表格、虚拟表、虚拟树表和列级文本溢出策略；不传时继承 hynGlobalConfig.overflowMode。',
        localDefault: '继承全局',
        labelOverflowMode:
          'HynForm 与 HynDialog 的 label 溢出局部参数；不传时继承 hynGlobalConfig.overflowMode，用于覆盖单个表单或弹窗。',
        autoWidth:
          'HynDialog 配置化表单弹窗默认开启。width 是期望下限，实际宽度按当前语言 label、控件文本、列间距和 body padding 计算。',
        supportedName: '支持组件',
        supportedDefault: 'HYN 公共组件',
        supportedComponents:
          '支持范围：HynTable、HynVirtualTable、HynVirtualTreeTable、HynForm、HynDialog；HynDialog 额外支持 autoWidth。',
        priorityName: '优先级与文档规则',
        required: '必须遵守',
        priorityRule:
          '优先级固定为：局部 prop、列配置或 label 显式配置 > HYN 全局配置 > fit。新增 HYN 公共行为配置必须同步补到本菜单、HYN_COMPONENT_SYSTEM.md 和 HYN AI reference。'
      },
      codeTitle: '配置入口',
      code: `// src/components/Hyn/shared/overflow.ts
// 这个 type 只限制合法值，不提供运行时默认值。
export type HynTextOverflowMode = 'fit' | 'ellipsis' | 'wrap';

// src/components/Hyn/config.ts
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { HynTextOverflowMode } from './shared/overflow';

/** HYN 全局组件配置，集中维护跨 HYN 公共组件共享的默认展示协议。 */
export interface HynGlobalConfig {
  /** 文本超出组件可用范围时的默认处理方式，局部组件 prop 或列配置优先级更高。 */
  overflowMode: HynTextOverflowMode;
}

// 运行时默认值来自这里，所以系统默认是 fit。
export const hynGlobalConfig: HynGlobalConfig = {
  overflowMode: 'fit'
};

// App.vue
provideHynGlobalConfig(hynGlobalConfig);`
    },
    modes: {
      kicker: '溢出策略',
      title: 'overflowMode 三态协议',
      description:
        '这个配置表达布局意图，不只是 CSS 裁剪开关。默认 fit 服务多语言完整展示，ellipsis 和 wrap 需要调用方明确选择。',
      codeTitle: '三态协议类型源头',
      code: `// 1. 修改三态协议的唯一类型源头；这里不会产生默认值
// src/components/Hyn/shared/overflow.ts
export type HynTextOverflowMode = 'fit' | 'ellipsis' | 'wrap';

// 2. 全系统运行时默认策略只改这里
// src/components/Hyn/config.ts
export const hynGlobalConfig: HynGlobalConfig = {
  overflowMode: 'fit'
};

// 3. 未注入 provider 的独立场景也会回到这个默认配置
export function useHynGlobalConfig(): HynGlobalConfig {
  return inject(hynGlobalConfigKey, hynGlobalConfig);
}

// 4. 页面或列确实需要不同策略时，使用局部覆盖
<hyn-table overflow-mode="ellipsis" />
<hyn-form label-overflow-mode="wrap" />

const columns: HynTableColumn<UserRow>[] = [
  { prop: 'name', label: t('app.user.name'), overflowMode: 'fit' }
];`,
      cards: {
        fit: {
          title: '优先完整显示',
          description: '优先单行完整显示，通过列宽、弹窗宽度或横向滚动承载长文本；空间确实不足时再由布局切换处理。'
        },
        ellipsis: {
          title: '真实溢出才省略',
          description: '只在调用方明确要求省略时使用；必须基于真实溢出检测提供 tooltip，不能无提示截断。'
        },
        wrap: {
          title: '明确允许换行',
          description: '用于调用方确定可以换行的内容；虚拟表固定行高场景不能无意继承 wrap 造成行高错乱。'
        }
      }
    },
    priority: {
      kicker: '覆盖关系',
      title: '局部覆盖优先于全局',
      description:
        '全局配置只负责默认值，不能夺走页面或列配置的明确意图。调用方写了 prop 或列级配置时，HYN 必须尊重它。',
      cardTitle: '解析顺序',
      checks: {
        explicit: '组件 prop、列级 overflowMode、labelOverflowMode 等显式配置优先。',
        global: '没有局部配置时读取 hynGlobalConfig.overflowMode。',
        default: '没有注入或配置为空时固定回到 fit。',
        virtualTable: '虚拟表默认仍以 fit 承载横向空间，只有显式 ellipsis 或 wrap 才改变单元格展示协议。'
      },
      codeTitle: '局部覆盖示例'
    },
    maintenance: {
      kicker: '维护约束',
      title: '新增公共配置的文档规则',
      description: '全局配置是 HYN 公共契约，不是隐藏实现细节。新增配置必须同步更新用户可见文档和 AI reference。',
      cardTitle: '验收清单',
      checks: {
        configFile: '配置入口仍保持在 src/components/Hyn/config.ts。',
        publicTypes: '公共类型从 HYN public types 入口暴露，不让页面导入内部文件。',
        docsPage: '本菜单必须写清默认值、作用范围、局部覆盖方式和验证要点。',
        overview: '全局配置相关内容继续放在本菜单；总览保持精简，只放入口级信息，不承载完整配置协议。',
        references:
          '同步维护 HYN_COMPONENT_SYSTEM.md 和 .codex/skills/frontend-crud-coding/references/hyn-components.md。'
      }
    }
  },
  i18nBoundary: {
    hero: {
      kicker: 'AI 多语言指南',
      title: '多语言边界',
      description:
        '这页不是固定页面模板，而是 AI 在任何功能里遇到文案、后端展示值或 HYN 文档示例时必须执行的判断护栏。',
      pills: {
        fixedUi: '固定 UI 前端 key 化',
        backendContract: '业务值看后端契约',
        audit: 'i18n 审计兜底'
      }
    },
    ownership: {
      kicker: '第一性原则',
      title: '先判断文本归属',
      description: '不要先想翻译，而是先判断谁拥有这段文本。归属判断正确，多语言实现才不会把业务数据误翻译。',
      cards: {
        fixedUi: {
          kind: 'Frontend',
          title: '固定 UI 文案',
          description:
            '按钮、标题、placeholder、弹窗、消息、校验、空状态、aria 和上传下载提示都使用稳定 i18n key，并同步 zh_CN/en_US。'
        },
        businessData: {
          kind: 'Backend',
          title: '业务数据',
          description:
            '部门、角色、岗位、应用、字典、菜单、错误消息和用户输入默认展示原值；只有后端给 key 或 localized 字段时才翻译。'
        },
        docsDemo: {
          kind: 'Docs / Demo',
          title: '文档与本地示例',
          description:
            'HYN 组件文档页、Component Atlas 和本地 demo 是前端可见内容，使用 `hynDocs.*`，但 demo 中模拟的业务值不能推广成真实业务翻译。'
        }
      }
    },
    matrix: {
      kicker: '决策矩阵',
      title: '遇到这些场景怎么做',
      description: '功能和页面没有固定形态，但文本责任边界是固定的。',
      aria: '多语言边界决策矩阵',
      columns: {
        scene: '场景',
        frontend: '前端动作',
        backend: '后端契约'
      },
      rows: {
        button: {
          scene: '按钮 / 弹窗 / 校验 / 空状态',
          frontend: '新增稳定 key，补齐 zh_CN 与 en_US，使用 t() 或 $t()。',
          backend: '不需要后端参与。',
          codeTitle: '固定 UI：key + 插值业务值'
        },
        department: {
          scene: '部门树 / 组织树 / 岗位 / 角色 / 应用',
          frontend: '无契约时展示 deptName、roleName、postName、appName 等原值，不猜英文。',
          backend: '如需英文，提供 nameKey 或 labels.zh_CN/en_US。',
          codeTitle: '业务树：列标题翻译，节点名原样展示'
        },
        dictionary: {
          scene: '字典项 / 业务枚举',
          frontend: '无契约时展示 dictLabel；有 labelKey 或 localized label 时按契约翻译。',
          backend: '提供稳定 code 加 labelKey，或 labels.zh_CN/en_US。',
          codeTitle: '字典项：消费后端 label，不写前端猜译表'
        },
        backendError: {
          scene: '后端业务错误',
          frontend: '无 messageKey/code 时按原错误处理策略展示，不从中文错误消息猜译。',
          backend: '提供稳定 error code 或 messageKey。',
          codeTitle: '后端错误：有 key 才前端翻译'
        },
        hynDocs: {
          scene: 'HYN 文档 / 本地 demo',
          frontend: '所有可见文字使用 `hynDocs.*`，页面示例保持中英结构一致。',
          backend: '不需要后端参与；真实业务页另按接口契约处理。',
          codeTitle: 'HYN 文档：本地示例也走 hynDocs key'
        }
      }
    },
    codeExamples: {
      kicker: '同步示例',
      title: '场景与代码一一对应',
      description: '下面的代码块由同一组矩阵数据渲染，修改场景时必须同时修改对应示例，避免 AI 只读规则不懂落地。'
    },
    aiChecklist: {
      kicker: 'AI 执行',
      title: '每次任务的最小检查',
      description: '这不是瀑布流程，只是在改到可见文本或业务展示值时必须停一下做判断。',
      cardTitle: '交付前检查',
      items: {
        classifyText: '新增或修改的文本是否已经分成固定 UI、HYN demo、后端业务值、开发诊断？',
        addKeys: '固定 UI 和 HYN demo 是否同步补齐 `src/lang/modules/zh_CN` 与 `src/lang/modules/en_US`？',
        noGuessing: '是否避免了中文业务值到英文值的前端猜译映射？',
        audit: '涉及 UI 文案、语言包、公共组件或模板时是否运行 `pnpm i18n:audit`？',
        handoff: '交付说明是否写清后端缺失的 key 或 localized 字段？'
      },
      codeTitle: '交付说明模板',
      code: `多语言处理：
- 固定 UI 文案：已补齐 zh_CN/en_US。
- 业务数据：部门、字典、菜单等后端值按原字段展示，未做前端猜译。
- 后端阻塞：如需英文业务值，需要后端提供 nameKey、labelKey、messageKey 或 labels.zh_CN/en_US。
验证：pnpm i18n:audit 通过。`
    }
  },
  home: {
    hero: {
      kicker: 'HYN 组件体系',
      title: '给人和 AI 共用的组件地图',
      description:
        '这套文档只在本地开发环境使用，目标是把组件选型、配置示例、视觉契约和 AI 禁止项放到同一个可验证入口。生产远端不携带文档页，也不依赖文档路由。',
      pills: {
        localOnly: '仅本地',
        aiCopyable: 'AI 可复制',
        typedExamples: '类型化示例',
        visualContract: '视觉契约'
      }
    },
    metrics: {
      routeMode: {
        label: '路由模式',
        value: '仅开发',
        note: '通过本地 .local.ts 路由访问，远端生产不携带。'
      },
      docShape: {
        label: '文档形态',
        value: 'Recipes',
        note: '每页都有可复制模板、字段 recipes 和验收清单。'
      },
      designGoal: {
        label: '设计目标',
        value: 'Useful',
        note: '服务真实编码，不做只有展示价值的漂亮壳。'
      }
    },
    componentDocs: {
      kicker: '组件文档',
      title: '组件入口',
      description: '每个组件页都包含结论、适用边界、live demo、复制代码、API、recipes、AI 规则和验收清单。'
    },
    decisionMatrix: {
      kicker: '决策矩阵',
      title: '组件选型矩阵',
      description: '新建页面时先按业务场景选组件，不按“哪个更熟”选组件。',
      aria: 'HYN 组件选型矩阵',
      columns: {
        scene: '场景',
        component: '默认组件',
        reason: '原因和边界'
      },
      rows: {
        pagedCrud: {
          scene: '普通分页 CRUD',
          component: 'HynTable + HynDialog',
          reason: '默认入口。表格列配置和弹窗字段配置都由 TS 描述，样式和 tooltip 由 HYN 层统一。'
        },
        flatLargeData: {
          scene: '大数据平铺列表',
          component: 'HynVirtualTable',
          reason: '适合授权弹窗、日志、审计、实体候选等几百行以上列表；不强塞原生表格复杂能力。'
        },
        treeTable: {
          scene: '组织、部门、权限树表',
          component: 'HynVirtualTreeTable',
          reason: '由 hook 管树索引、展开和懒加载状态，避免页面重复写树算法。'
        },
        inlineEntity: {
          scene: '表单内实体选择',
          component: 'HynRemoteSelect / remoteSelect field',
          reason: '用户、角色、岗位等实体必须支持远程搜索和稳定回显，不能简单堆全量 el-select。'
        },
        dialogEntity: {
          scene: '弹窗式跨页实体选择',
          component: 'HynEntityPicker',
          reason: '适合授权用户、跨页多选、搜索后确认；内部复用虚拟表。'
        }
      }
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '默认生成规则',
      description: '把这段放进新建 CRUD 任务里，AI 应直接按公司级组件模板生成，不再回退裸 Element Plus 表格和弹窗。',
      codeTitle: 'AI Prompt 片段',
      code: `新建普通分页 CRUD 页面时：
- 主表必须使用 HynTable，不直接堆 el-table-column。
- 新增/编辑弹窗必须使用 HynDialog + fields，不手写 el-row/el-col/el-form-item 表单网格。
- 大数据平铺列表使用 HynVirtualTable。
- 树表使用 HynVirtualTreeTable + useHynVirtualTreeTable。
- 用户、角色、岗位等实体选择使用 HynRemoteSelect 或 HynEntityPicker。
- 页面不得写 .hyn-table、.hyn-dialog、.data-table、:deep(.el-table*)、:deep(.el-form-item) 覆盖样式。
- 完成后运行 vue-tsc、lint、build:dev，并用浏览器检查表格 tooltip、弹窗边框、滚动和 footer。`
    },
    i18nBoundary: {
      kicker: '多语言边界',
      title: 'Multilingual Boundary',
      description:
        'HYN 文档页服务人和 AI，但仍遵守全系统多语言边界：固定 UI 由前端 key 化，真实业务数据由后端契约决定。',
      cards: {
        docs: {
          kind: 'Docs / Demo',
          title: '文档与本地示例',
          description: '组件 Atlas、组件文档页和本地 demo 的可见文本使用 `hynDocs.*`，同步维护 zh_CN 与 en_US。'
        },
        business: {
          kind: 'Business Data',
          title: '业务值不猜译',
          description:
            '部门、角色、岗位、应用、字典和菜单名只消费后端确认的 key 或 localized 字段；没有契约时展示原值。'
        },
        audit: {
          kind: 'AI Guardrail',
          title: '执行护栏',
          description: '完整判断写在 `docs/i18n-ai-coding-guide.md`；该文档是文本归属和审查指南，不是固定页面实现流程。'
        }
      }
    },
    design: {
      kicker: '文档设计',
      title: '文档设计原则',
      description: '参考多家成熟组件库，但只吸收对本项目有用的部分。',
      principles: {
        apiLayers: {
          kind: 'Element Plus',
          title: '保留 API 分层',
          description: '保留 props、events、slots 的基础结构，但补足业务边界和 AI 示例。'
        },
        scenarioFirst: {
          kind: 'Ant Design',
          title: '场景优先',
          description: '按真实业务任务组织示例，而不是只按控件属性堆 demo。'
        },
        dataModel: {
          kind: 'MUI X',
          title: '数据模型清晰',
          description: '把 rows、columns、adapter、field config 的数据结构讲明白。'
        },
        doDont: {
          kind: 'Polaris',
          title: 'Do / Don’t',
          description: '明确使用建议和禁止项，减少 AI 生成时误走旧路。'
        }
      }
    },
    localOnly: {
      kicker: '仅本地',
      title: '本地化隔离',
      description: '组件文档是本地开发资产，生产远端不应包含文档源码、文档 markdown 或文档路由。',
      boundaryTitle: '远端边界',
      checks: {
        viewPath: '文档页位于 `src/views/component/hyn/`，已加入 gitignore。',
        routePath: '文档路由位于 `src/router/modules/*.local.ts`，只在 Vite dev server 下加载。',
        noStaticImport: '生产代码不静态 import HYN 文档文件。',
        localMarkdown: 'markdown 组件文档也只保留在本地，不进入远端。',
        i18nBoundary:
          '文档页和本地 demo 的可见文本使用 `hynDocs.*`；真实业务数据仍按后端 key 或 localized 字段契约处理。'
      },
      grepTitle: 'Grep 验收'
    }
  },
  dialog: {
    hero: {
      kicker: '反馈 / 表单协议',
      title: 'HynDialog',
      description:
        '普通新增、编辑弹窗默认只写 TS 字段配置。HynDialog 负责弹窗壳、footer、内部滚动、表单网格、label tooltip、控件宽度、校验和错误滚动，页面不再手写表单布局样式。',
      pills: {
        schema: 'fields schema',
        renderers: 'typed renderers',
        validate: 'internal validate',
        slot: 'slot escape hatch'
      }
    },
    metrics: {
      defaultMode: {
        label: 'Default mode',
        value: 'Form',
        note: '传入 model 和 fields 后进入配置化表单模式。'
      },
      submitFlow: {
        label: 'Submit flow',
        value: 'Validate first',
        note: '确认按钮先调用内部 validate，通过后触发 submit。'
      },
      escapeHatch: {
        label: 'Escape hatch',
        value: 'Slot',
        note: '详情、导入、权限树等非标准内容继续用 slot。'
      }
    },
    live: {
      kicker: '实时示例',
      title: '普通新增/编辑弹窗',
      description: '点击打开示例，重点看数字输入框右边框、两列布局、textarea 整行、footer loading 和 label tooltip。',
      openButton: '打开配置化表单弹窗',
      dialogTitle: '维护岗位',
      postCodeTooltip: '保存后通常不建议随意修改编码',
      submitSuccess: '表单校验通过',
      status: {
        enabled: '启用',
        disabled: '停用'
      }
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '标准 CRUD 弹窗模板',
      description: '普通新增/编辑页面复制这个结构即可；标准两列表单使用 640px / 92px，小型单列表单才显式收窄。',
      codeTitle: 'HynDialog + fields',
      code: `<hyn-dialog
  ref="dialogRef"
  v-model="dialog.visible"
  :title="dialog.title"
  width="640px"
  :model="form"
  :fields="formFields"
  :rules="rules"
  label-width="92px"
  :form-loading="buttonLoading"
  :confirm-loading="buttonLoading"
  {'@'}submit="submitForm"
  {'@'}cancel="cancel"
  {'@'}closed="resetForm"
/>

const formFields = computed<HynDialogField<PostForm>[]>(() => [
  {'{'} key: 'postName', label: t('app.systemPost.field.postName'), prop: 'postName', type: 'input', placeholder: t('app.systemPost.placeholder.postName'), maxlength: 30 {'}'},
  {'{'} key: 'postCode', label: t('app.systemPost.field.postCode'), prop: 'postCode', type: 'input', placeholder: t('app.systemPost.placeholder.postCode'), maxlength: 64 {'}'},
  {'{'} key: 'postSort', label: t('app.systemPost.field.postSort'), prop: 'postSort', type: 'number', min: 0, step: 1 {'}'},
  {'{'} key: 'status', label: t('app.systemPost.field.status'), prop: 'status', type: 'radio', options: statusOptions.value {'}'},
  {'{'} key: 'remark', label: t('app.systemPost.field.remark'), prop: 'remark', type: 'textarea', rows: 4, maxlength: 200, showWordLimit: true {'}'}
]);`
    },
    recipes: {
      kicker: '字段配置',
      title: '字段 type 配置示例',
      description: '每种 field type 都有独立类型，不使用一个巨大的 componentProps:any 兜底。',
      codeTitle: '{type} field',
      items: {
        input: {
          type: 'input',
          title: '单行文本',
          span: 'span: 1',
          description: '适合名称、编码、邮箱、手机号等短文本。密码字段使用 showPassword。',
          code: `{'{'} key: 'postName', label: t('app.systemPost.field.postName'), prop: 'postName', type: 'input', placeholder: t('app.systemPost.placeholder.postName'), maxlength: 30 {'}'}`
        },
        textarea: {
          type: 'textarea',
          title: '多行文本',
          span: 'full',
          description: '适合备注、说明、公告摘要。默认应整行，避免两列里高度不一致。',
          code: `{'{'} key: 'remark', label: t('app.common.remark'), prop: 'remark', type: 'textarea', rows: 4, maxlength: 200, showWordLimit: true {'}'}`
        },
        number: {
          type: 'number',
          title: '数字输入',
          span: 'span: 1',
          description: '适合排序、阈值、数量。HYN 层统一 controls-position 和右边框。',
          code: `{'{'} key: 'orderNum', label: t('app.systemPost.field.postSort'), prop: 'orderNum', type: 'number', min: 0, step: 1, precision: 0 {'}'}`
        },
        select: {
          type: 'select',
          title: '枚举下拉',
          span: 'span: 1',
          description: '适合公告类型、系统内小枚举。用户、角色等实体不要用它，要用 remoteSelect。',
          code: `{'{'} key: 'noticeType', label: t('app.systemNotice.field.noticeType'), prop: 'noticeType', type: 'select', clearable: true, options: noticeTypeOptions.value {'}'}`
        },
        radio: {
          type: 'radio',
          title: '少量互斥选项',
          span: 'span: 1',
          description: '适合启停状态、是否外链等 2 到 4 个互斥项。',
          code: `{'{'} key: 'status', label: t('app.common.status'), prop: 'status', type: 'radio', options: statusOptions.value {'}'}`
        },
        checkbox: {
          type: 'checkbox',
          title: '小集合多选',
          span: 'full',
          description: '适合少量固定权限、开关集合。大量实体多选使用 remoteSelect 或 EntityPicker。',
          code: `{'{'} key: 'menuTypes', label: t('app.systemMenu.field.menuType'), prop: 'menuTypes', type: 'checkbox', options: menuTypeOptions.value {'}'}`
        },
        switch: {
          type: 'switch',
          title: '布尔或状态开关',
          span: 'span: 1',
          description: '适合是否启用、是否缓存、是否外链。值可以映射成后端字符串。',
          code: `{'{'} key: 'visible', label: t('app.systemMenu.field.visible'), prop: 'visible', type: 'switch', activeValue: '0', inactiveValue: '1' {'}'}`
        },
        date: {
          type: 'date',
          title: '单日期/时间',
          span: 'span: 1',
          description: '适合开始时间、截止时间。统一 valueFormat，避免页面各自处理 Date/string。',
          code: `{'{'} key: 'startTime', label: t('app.common.startDate'), prop: 'startTime', type: 'date', dateType: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' {'}'}`
        },
        dateRange: {
          type: 'dateRange',
          title: '日期范围',
          span: 'full',
          description: '适合有效期、查询范围编辑。范围控件默认整行。',
          code: `{'{'} key: 'validRange', label: t('app.common.startDate'), prop: 'validRange', type: 'dateRange', dateType: 'daterange', valueFormat: 'YYYY-MM-DD' {'}'}`
        },
        treeSelect: {
          type: 'treeSelect',
          title: '小型树选择',
          span: 'full',
          description: '适合部门、上级菜单等规模可控的树选择。大树能力应使用专属 HYN 树能力。',
          code: `{'{'} key: 'parentId', label: t('app.systemMenu.field.parentId'), prop: 'parentId', type: 'treeSelect', data: menuOptions.value, props: treeSelectProps, linkage: false, clearable: true {'}'}`
        },
        remoteSelect: {
          type: 'remoteSelect',
          title: '远程实体选择',
          span: 'full',
          description: '适合用户、角色、岗位等可增长实体，必须提供 adapter 和 fetchByKeys 稳定回显。',
          code: `{'{'} key: 'roleIds', label: t('app.systemRole.field.roleName'), prop: 'roleIds', type: 'remoteSelect', adapter: roleEntityAdapter, searchParam: 'roleName', multiple: true {'}'}`
        },
        iconSelect: {
          type: 'iconSelect',
          title: '图标选择',
          span: 'span: 1',
          description: '适合菜单图标字段。图标选择器仍由现有组件承载。',
          code: `{'{'} key: 'icon', label: t('app.systemMenu.field.icon'), prop: 'icon', type: 'iconSelect' {'}'}`
        },
        editor: {
          type: 'editor',
          title: '富文本',
          span: 'full',
          description: '适合公告内容。默认整行，避免编辑器被两列网格压窄。',
          code: `{'{'} key: 'noticeContent', label: t('app.systemNotice.field.noticeContent'), prop: 'noticeContent', type: 'editor', minHeight: 240 {'}'}`
        },
        imageUpload: {
          type: 'imageUpload',
          title: '图片上传',
          span: 'full',
          description: '适合封面、头像、图片资料。图片预览弹窗不要塞进 HynDialog 字段。',
          code: `{'{'} key: 'coverUrl', label: t('app.common.import'), prop: 'coverUrl', type: 'imageUpload', limit: 1, fileSize: 5, fileType: ['png', 'jpg', 'jpeg'] {'}'}`
        },
        fileUpload: {
          type: 'fileUpload',
          title: '文件上传',
          span: 'full',
          description: '适合附件上传并写回后端文件路径，不用于导入前暂存本地文件。',
          code: `{'{'} key: 'attachment', label: t('app.common.import'), prop: 'attachment', type: 'fileUpload', limit: 3, fileSize: 20, fileType: ['pdf', 'doc', 'docx', 'xlsx'] {'}'}`
        },
        filePicker: {
          type: 'filePicker',
          title: '本地文件选择',
          span: 'full',
          description: '适合简单导入。只把 File 写入模型，提交时由页面构造 FormData 调业务接口。',
          code: `{'{'} key: 'file', label: t('app.common.import'), prop: 'file', type: 'filePicker', drag: true, fileType: ['xls', 'xlsx'], buttonText: t('app.common.import') {'}'}`
        },
        display: {
          type: 'display',
          title: '只读展示',
          span: 'span: 1',
          description: '适合详情弹窗中展示创建人、创建时间、系统生成编号。',
          code: `{'{'} key: 'createTime', label: t('app.common.createTime'), type: 'display', formatter: model => String(model.createTime ?? '-') {'}'}`
        },
        slot: {
          type: 'slot',
          title: '受控逃生口',
          span: 'full',
          description: '适合 HYN 统一包 form-item，但内容必须由业务子组件承载的场景。',
          code: `{'{'} key: 'permissionTree', label: t('app.systemMenu.field.perms'), type: 'slot', slot: 'permissionTree', span: 'full' {'}'}`
        }
      }
    },
    reference: {
      kicker: '参考',
      title: '组件 API',
      description: 'HynDialog 只封装普通弹窗和普通表单，不接管权限树、导入、预览、代码查看等复杂业务内容。',
      aria: 'HynDialog API',
      columns: {
        field: '字段',
        type: '类型',
        description: '说明'
      },
      rows: {
        modelValue: '控制弹窗显示隐藏。',
        title: '弹窗标题，新增、编辑、详情应使用清晰业务名。',
        widthTop: '弹窗宽度和顶部距离；配置化表单默认自动按当前语言计算，纯 slot 弹窗默认 560px。',
        buttonText: '底部按钮文案，默认“确定 / 取消”。',
        confirmLoading: '确认按钮 loading 状态，提交期间必须由业务页控制。',
        showFooter: '详情弹窗或完全自定义 footer 时可关闭默认 footer。',
        model: '配置化表单的数据对象。传入 model 和 fields 后，确认按钮会先执行表单校验。',
        fields: '字段配置数组，每个 type 有自己的 props 类型。',
        rules: 'Element Plus 表单校验规则，继续复用官方 Form 能力。',
        columns: '表单列数，默认两列；小屏由 HYN 样式自动收敛为一列。',
        labelWidth: '统一 label 宽度，配置化弹窗默认 92px，不在页面写局部 label 样式。',
        submit: '配置化表单校验通过后触发。普通新增/编辑优先使用这个事件。',
        confirm: 'slot 弹窗使用的确认事件，不做内部表单校验。',
        expose: '替代页面直接拿 el-form ref。'
      }
    },
    boundary: {
      kicker: 'Do / Don’t',
      title: '边界规则',
      description: '配置化不是把所有业务都塞进 HynDialog，而是把高频普通表单收归统一。',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        modelFields: "普通新增/编辑弹窗使用 `model + fields + rules + {'@'}submit`。",
        tooltip: 'label 辅助说明使用字段 `tooltip`，不要手写 label slot。',
        filePicker: "简单导入使用 `filePicker` 暂存本地文件，再在 `{'@'}submit` 中构造 `FormData`。",
        slotContent: '详情、复杂导入、权限树、代码预览继续 slot，但不能覆盖 HYN 弹窗壳样式。',
        childComponent: '需要复杂业务区域时抽子组件，slot 只承载内容，不写全局 deep 样式。'
      },
      dontItems: {
        rawGrid: '不要在普通表单里手写 `el-row/el-col/el-form-item` 网格。',
        extraClasses: '不要新增 `.dialog-form`、`.dialog-grid-form`、`.permission-dialog-form`。',
        deepOverrides: '不要在页面里写 `:deep(.el-form-item)` 或 `:deep(.el-input-number)` 覆盖。',
        permissionTree: '不要把角色权限树、复杂导入流程做成 HynDialog 字段 type。'
      }
    },
    acceptance: {
      kicker: '验收',
      title: '验收清单',
      description: '弹窗改造完成后按下面的客观指标验收，不靠“看着还行”。',
      manualTitle: '人工验收',
      codeTitle: 'Style Guard',
      items: {
        numberBorder: '数字输入框右边框完整，controls-position 为 right。',
        columns: '两列字段宽度稳定，小屏自动一列。',
        fullFields: 'textarea、editor、imageUpload、fileUpload、filePicker、treeSelect 默认整行。',
        bodyScroll: '内容超高时 body 内部滚动，不撑破视口。',
        loading: 'submit loading 期间确认按钮 loading，取消按钮行为稳定。'
      },
      code: `rg "dialog-form|dialog-grid-form|permission-dialog-form" src/views
rg ":deep\\(\\.el-form-item|:deep\\(\\.el-input-number|:deep\\(\\.hyn-dialog" src/views
rg "<el-dialog" src/views`
    }
  },
  entityPicker: {
    hero: {
      kicker: '数据录入',
      title: 'HynRemoteSelect / HynEntityPicker',
      description:
        '面向用户、角色、岗位、应用等实体选择。第一版先证明普通 el-select / el-table 在大数据下的边界，再把远程搜索、虚拟列表、分页表格和已选回显沉淀为组件。',
      pills: {
        remoteSearch: '远程搜索',
        virtualDropdown: '虚拟下拉',
        crossPage: '跨页选择',
        benchmark: '可验证基准'
      }
    },
    metrics: {
      target: {
        label: '目标',
        value: '实体选择',
        note: '用户、角色、岗位、应用等可增长对象。'
      },
      validation: {
        label: '验证方式',
        value: 'Benchmark',
        note: '用 DOM 数量和耗时证明收益。'
      },
      boundary: {
        label: '替换边界',
        value: '高成本',
        note: '小枚举继续使用 Element Plus。'
      }
    },
    fields: {
      name: '名称',
      code: '编码',
      status: '状态'
    },
    placeholders: {
      name: '请输入名称',
      code: '请输入编码'
    },
    status: {
      enabled: '启用',
      disabled: '停用'
    },
    apiColumns: {
      field: '字段',
      type: '类型',
      description: '说明'
    },
    benchmark: {
      kicker: '基准测试',
      title: '旧下拉与虚拟下拉对比',
      description: '切换数据量后打开两个选择器，点击“刷新指标”查看当前弹层 DOM 数量和准备耗时。',
      legacyTitle: '普通 el-select',
      legacyDescription: '模拟全量 option。数据量越大，选项 DOM 和过滤成本越接近线性增长。',
      remoteTitle: 'HynRemoteSelect',
      remoteDescription: '模拟远程第一页和虚拟 option。候选项不会随总量一次性全部渲染。',
      legacyPlaceholder: '旧方案：全量选项',
      legacySkippedPlaceholder: '旧方案：{limit}+ 条会卡死，已停止渲染',
      remotePlaceholder: '新方案：远程虚拟选择',
      refreshButton: '刷新指标',
      demoName: '演示实体 {index}',
      metrics: {
        skippedValue: '已跳过',
        total: {
          label: '数据量',
          note: '当前模拟实体总数。'
        },
        legacyDom: {
          label: '旧 option DOM',
          note: '普通 el-select 打开后的 option 节点数。',
          skippedNote: '超过 {limit} 条时旧方案会锁死文档页，这里故意不再渲染全量 option。'
        },
        virtualDom: {
          label: '虚拟 option DOM',
          note: '虚拟下拉打开后的 option 节点数。'
        },
        legacyCost: {
          label: '旧下拉打开耗时',
          note: 'visible-change 到下一帧的近似成本。',
          skippedNote: '5000 模式卡顿来自旧全量下拉，右侧 HYN 仍按分页加载。'
        }
      }
    },
    pickerSample: {
      kicker: '选择器示例',
      title: '弹窗实体选择',
      description: '弹窗选择复用 HynVirtualTable，适合授权用户、跨页多选、列表搜索后确认。',
      openButton: '打开实体选择弹窗',
      dialogTitle: '选择演示实体',
      selectedRows: '上次确认选择 {count} 个实体。'
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '实体选择标准模板',
      description: '表单内实体选择用 HynRemoteSelect；跨页选择、授权用户这类场景用 HynEntityPicker。',
      remoteSelectTitle: 'Remote select field',
      entityPickerTitle: 'Entity picker dialog',
      remoteSelectCode: `const roleField: HynDialogField<UserForm> = {'{'}
  key: 'roleIds',
  label: t('app.systemRole.field.roleName'),
  prop: 'roleIds',
  type: 'remoteSelect',
  adapter: roleEntityAdapter,
  searchParam: 'roleName',
  multiple: true,
  collapseTags: true,
  maxCollapseTags: 2,
  placeholder: t('app.systemRole.placeholder.roleName')
{'}'};`,
      entityPickerCode: `<hyn-entity-picker
  v-model="selectedUserIds"
  v-model:visible="pickerVisible"
  :title="t('app.systemUser.authUser')"
  :adapter="userEntityAdapter"
  :columns="userPickerColumns"
  :search-fields="userPickerSearchFields"
  {'@'}confirm="handleUserPickerConfirm"
/>`
    },
    remoteSelectApi: {
      kicker: 'Remote Select API',
      title: 'HynRemoteSelect 字段说明',
      description: '用于表单内远程实体选择，关键点是分页搜索、虚拟下拉和已选 key 稳定回显。',
      aria: 'HynRemoteSelect 字段说明',
      rows: {
        modelValue: '当前选中的实体 key。多选时是 key 数组，单选时是单个 key；支持 string 和 number 主键。',
        adapter: '必填。封装分页查询、按 key 回显、key/label/disabled 读取和初始查询条件。',
        searchParam: '远程搜索关键字写入的查询字段，例如 roleName、postName、userName。',
        pageSize: '每次远程加载的候选项数量。默认 20，数据较轻时可在业务字段里显式放大。',
        multiple: '是否多选。默认 false；用户、角色、岗位等表单字段通常设置为 true。',
        placeholder: '未选择时的占位文案；HynDialog remoteSelect field 默认使用“请选择 + 字段 label”。',
        disabled: '禁用当前选择器，常用于编辑自己时禁止修改岗位、角色等关系。',
        clearable: '是否允许清空。默认 true；清空后会同步触发 v-model 和 clear 事件。',
        collapseTags: '多选标签是否折叠。默认 true，用于避免大量实体标签撑高表单行。',
        maxCollapseTags: '折叠前展示的标签数量。默认 1，常见表单可设置为 2。',
        dropdownHeight: '虚拟下拉面板高度。默认 274，和 optionHeight 一起决定可见候选项数量。',
        optionHeight: '单个虚拟选项高度。默认 34，需要和实际 option 行高保持一致。',
        teleported: '弹层是否挂到 body。默认 false，避免文档或弹窗内部滚动时下拉和输入框分离。',
        change: '选中值变化事件，返回外部 key 值和当前已解析的实体行。',
        clear: '清空事件。业务需要额外清理关联字段时使用。'
      }
    },
    entityPickerApi: {
      kicker: 'Entity Picker API',
      title: 'HynEntityPicker 字段说明',
      description: '用于弹窗式实体选择，适合跨页多选、授权用户和需要表格列信息的场景。',
      aria: 'HynEntityPicker 字段说明',
      rows: {
        modelValue: '当前选中的实体 key。多选返回 key 数组，单选返回单个 key。',
        visible: '弹窗显示状态，由调用方控制打开和关闭。',
        title: '弹窗标题，同时用于表格面板标题和确认语义。',
        adapter: '必填。弹窗列表分页、跨页选中回显和禁用判断都依赖同一个 adapter。',
        columns: '表格列配置，复用 HynVirtualTableColumn，支持列宽、对齐和插槽。',
        searchFields: '弹窗顶部搜索字段。每个字段写入 query 的文本条件，不承载树筛选。',
        multiple: '是否多选。默认 true；单选选择器可以显式设置为 false。',
        pageSize: '弹窗表格每页条数。默认 10，打开弹窗时会覆盖 initial query 的 pageSize。',
        emptyText: '无数据文案。默认“暂无数据”。',
        dialogWidth: '弹窗宽度。默认 min(800px, calc(100vw - 32px))，复杂列可由调用方显式放宽。',
        dialogTop: '弹窗 top 值。默认 15vh，矮屏会通过内部样式压缩表格最小高度。',
        showSelectedTags: '是否在表格头部显示已选标签。默认 false，避免大量标签干扰表格选择。',
        confirm: '点击确定后的确认事件，返回已选实体行和当前 key 值。',
        change: '选择状态变化事件，适合实时同步外部统计或联动按钮状态。',
        cancel: '点击取消时触发，组件会同时关闭 visible。'
      }
    },
    adapterContract: {
      kicker: 'Adapter Contract',
      title: 'adapter 完整契约',
      description: '`fetchByKeys` 不是可选优化，它决定已选值在搜索条件变化、分页切换和编辑回显时是否稳定。',
      codeTitle: 'HynEntityAdapter',
      code: `export const roleEntityAdapter: HynEntityAdapter<RoleVO, RoleQuery> = {'{'}
  async fetchPage(query) {'{'}
    const res = await listRole(query);
    return {'{'}
      total: res.data.total,
      rows: res.data.rows
    {'}'};
  {'}'},
  async fetchByKeys(keys) {'{'}
    if (keys.length === 0) {'{'}
      return [];
    {'}'}
    const res = await listRoleByIds(keys);
    return res.data;
  {'}'},
  getKey: row => row.roleId,
  getLabel: row => row.roleName,
  getDisabled: row => row.status === '1',
  createInitialQuery: () => ({'{'}
    pageNum: 1,
    pageSize: 10,
    roleName: ''
  {'}'})
{'}'};`
    },
    visual: {
      kicker: 'Visual Contract',
      title: '选择弹窗视觉契约',
      description: '实体选择器只沉淀数据和交互复杂度，外观必须继承系统表单、面板和表格 token。',
      aria: '选择弹窗视觉契约',
      columns: {
        object: '对象',
        rule: '规则',
        description: '说明'
      },
      rows: {
        selectorDialog: {
          type: '必须复用',
          description: '选择弹窗统一从公共 mixin 继承面板、表单 hover/focus 和表格 hover token。'
        },
        dialogWidth: {
          type: '中等宽度',
          description: '默认贴近授权弹窗尺寸，只有树选择或复杂双栏布局才由调用方显式放宽。'
        },
        showSelectedTags: {
          type: '默认关闭',
          description: '表格选择默认依赖复选框和统计文案表达已选项，避免选择后出现额外标签块。'
        }
      }
    },
    reference: {
      kicker: 'Reference',
      title: '适用边界',
      description: '这个组件只服务实体数据选择，不替换状态、性别、公告类型等小枚举下拉。',
      aria: '实体选择组件 API',
      columns: {
        object: '对象',
        type: '类型',
        description: '说明'
      },
      rows: {
        adapter: '统一封装分页查询、按 key 回显、key/label/disabled 读取。',
        remoteSelect: '表单内远程实体选择，优先替换大实体 el-select。',
        entityPicker: '弹窗表格实体选择，适合授权用户和跨页多选。',
        searchFields: '弹窗搜索区字段，不包含树筛选。'
      }
    },
    rules: {
      kicker: 'Do / Don’t',
      title: '实体选择规则',
      description: '实体选择的核心问题是远程搜索、分页和稳定回显，不是把下拉换个名字。',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        adapter: '用户、角色、岗位、应用等可增长实体使用 adapter。',
        fetchByKeys: '编辑回显必须通过 `fetchByKeys` 反查 label。',
        crossPage: '跨页多选使用 HynEntityPicker，不依赖全量下拉。',
        remoteField: '表单内选择可通过 HynDialog 的 `remoteSelect` field 渲染。'
      },
      dontItems: {
        fullSelect: '不要给用户、角色、岗位这种实体生成全量 `el-select multiple`。',
        omitFetchByKeys: '不要省略 `fetchByKeys`，否则编辑页已选项会丢 label。',
        smallEnum: '不要把小枚举字典强行改成实体选择器。',
        styleOverride: '不要在业务页重写选择弹窗表格样式。',
        guessBusinessLabels: '不要从后端业务实体名称猜英文；只有后端给 key 或 localized 字段时才翻译。'
      }
    }
  },
  table: {
    hero: {
      kicker: '数据展示',
      title: 'HynTable',
      description:
        '面向普通分页 CRUD 的公司级表格入口，底层使用 Element Plus Table。业务页只维护行数据、列配置、slot 和分页，把文本溢出策略、时间列宽度、操作按钮权限和表格视觉协议沉淀到组件内部。',
      pills: {
        crud: '普通 CRUD',
        overflow: '完整显示优先',
        actions: '统一操作列',
        kernel: 'Element Plus 内核'
      }
    },
    metrics: {
      defaultEntry: {
        label: '默认入口',
        value: 'CRUD',
        note: '普通分页列表默认使用，不再手写大量 el-table-column。'
      },
      overflow: {
        label: '溢出策略',
        value: 'Fit',
        note: '默认完整单行显示并允许横向滚动；显式 ellipsis 才省略。'
      },
      actions: {
        label: '操作列',
        value: 'Unified',
        note: '按钮尺寸、tooltip、权限判断和禁用态统一。'
      }
    },
    live: {
      kicker: '实时示例',
      title: '普通表格示例',
      description: '文本列默认完整单行展示；状态列使用 slot，操作列复用统一按钮尺寸、hover、权限和禁用态。',
      emptyText: '暂无组件数据',
      selectedRows: '当前已选 {count} 行。',
      fields: {
        id: '编号',
        name: '名称',
        code: '编码',
        status: '状态',
        createTime: '创建时间',
        remark: '备注',
        action: '操作'
      },
      status: {
        enabled: '启用',
        disabled: '停用'
      },
      actions: {
        edit: '修改',
        delete: '删除'
      },
      rows: {
        standard: {
          name: '标准岗位维护',
          remark: '这是一段用于验证文本溢出策略的较长备注内容。'
        },
        notice: {
          name: '普通公告配置',
          remark: '短备注'
        },
        archive: {
          name: '历史数据归档',
          remark: '时间列即使被固定宽度截断，也必须保留清晰的展示策略。'
        }
      }
    },
    howTo: {
      kicker: 'How-to',
      title: '基础用法',
      description: '普通业务页声明 `HynTableColumn<VO>[]`，复杂展示列用 slot，标准修改/删除按钮放在 `actions`。',
      boundaryTitle: '适用边界',
      boundaryDescription:
        '普通分页 CRUD、生成器新页面、少量数据维护页默认使用 HynTable。日志、授权弹窗、几百行以上平铺列表应使用 HynVirtualTable；树表继续使用 HynVirtualTreeTable。',
      codeTitle: 'Vue Template',
      code: `<hyn-table
  v-model:selected-row-keys="selectedRowKeys"
  :rows="postList"
  :columns="postTableColumns"
  :row-key="getPostRowKey"
  :loading="loading"
  selection
  empty-text="暂无岗位数据"
  {'@'}selection-change="handlePostSelectionChange"
>
  <template #status="{'{'} row {'}'}">
    <dict-tag :options="sys_normal_disable" :value="row.status" />
  </template>
</hyn-table>`
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '普通 CRUD 表格模板',
      description: '新建普通分页页面直接复制这个模式，分页、搜索、导出仍由页面保持原有闭环。',
      codeTitle: 'HynTable standard CRUD',
      code: `<hyn-table
  v-model:selected-row-keys="selectedRowKeys"
  :rows="postList"
  :columns="postTableColumns"
  :row-key="getPostRowKey"
  :loading="loading"
  selection
  empty-text="暂无岗位数据"
  {'@'}selection-change="handleSelectionChange"
  {'@'}sort-change="handleSortChange"
>
  <template #status="{'{'} row {'}'}">
    <dict-tag :options="sys_normal_disable" :value="row.status" />
  </template>
</hyn-table>

const postTableColumns = computed<HynTableColumn<PostVO>[]>(() => [
  {'{'} key: 'postCode', label: t('app.systemPost.field.postCode'), prop: 'postCode', minWidth: 150 {'}'},
  {'{'} key: 'postName', label: t('app.systemPost.field.postName'), prop: 'postName', minWidth: 150 {'}'},
  {'{'} key: 'status', label: t('app.common.status'), prop: 'status', width: 100, align: 'center', slot: 'status' {'}'},
  {'{'} key: 'createTime', label: t('app.common.createTime'), prop: 'createTime', type: 'date', sortable: 'custom' {'}'},
  {'{'}
    key: 'action',
    label: t('app.common.action'),
    align: 'center',
    fixed: 'right',
    actions: [
      {'{'} key: 'edit', label: t('app.common.edit'), icon: Edit, permissions: ['system:post:edit'], onClick: handleUpdate {'}'},
      {'{'} key: 'delete', label: t('app.common.delete'), icon: Delete, type: 'danger', permissions: ['system:post:remove'], onClick: handleDelete {'}'}
    ]
  {'}'}
]);`
    },
    recipes: {
      kicker: '列配置',
      title: '列配置 recipes',
      description: '列配置要表达语义，不要回退到页面里堆 `el-table-column` 和 deep 样式。',
      items: {
        text: {
          kind: 'text',
          focus: 'fit',
          title: '普通文本列',
          description: '默认完整单行展示。只需要声明 label、prop 和宽度。',
          code: `{'{'} key: 'postName', label: t('app.systemPost.field.postName'), prop: 'postName', minWidth: 150 {'}'}`
        },
        date: {
          kind: 'date',
          focus: 'stable width',
          title: '时间列',
          description: '时间列默认稳定宽度，避免在常规列表中出现宽度抖动。',
          code: `{'{'} key: 'createTime', label: t('app.common.createTime'), prop: 'createTime', type: 'date' {'}'}`
        },
        slot: {
          kind: 'slot',
          focus: 'dict',
          title: '字典状态列',
          description: '复杂展示用 slot，但列宽和视觉仍由 HYN 表格协议控制。',
          code: `{'{'} key: 'status', label: t('app.common.status'), prop: 'status', width: 100, align: 'center', slot: 'status' {'}'}

<template #status="{'{'} row {'}'}">
  <dict-tag :options="sys_normal_disable" :value="row.status" />
</template>`
        },
        actions: {
          kind: 'actions',
          focus: 'permission',
          title: '统一操作列',
          description: '按钮尺寸、tooltip、权限和禁用态由 HYN action cell 统一处理。',
          code: `{'{'}
  key: 'action',
  label: t('app.common.action'),
  align: 'center',
  fixed: 'right',
  actions: [
    {'{'} key: 'edit', label: t('app.common.edit'), icon: Edit, permissions: ['system:post:edit'], onClick: handleUpdate {'}'},
    {'{'} key: 'delete', label: t('app.common.delete'), icon: Delete, type: 'danger', permissions: ['system:post:remove'], disabled: row => row.status === '1', onClick: handleDelete {'}'}
  ]
{'}'}`
        },
        sort: {
          kind: 'sort',
          focus: 'backend',
          title: '后端排序列',
          description: '后端排序继续使用 custom，不要因为迁移丢掉重置后的默认排序。',
          code: `{'{'} key: 'createTime', label: t('app.common.createTime'), prop: 'createTime', type: 'date', sortable: 'custom', sortOrders: ['descending', 'ascending', null] {'}'}

<hyn-table :default-sort="defaultSort" {'@'}sort-change="handleSortChange" />`
        },
        selection: {
          kind: 'selection',
          focus: 'rowKey',
          title: '选择列',
          description: '选择状态用主键数组受控，保留跨刷新稳定性。',
          code: `<hyn-table
  v-model:selected-row-keys="selectedRowKeys"
  :rows="postList"
  :columns="postTableColumns"
  :row-key="getPostRowKey"
  selection
  {'@'}selection-change="handleSelectionChange"
/>`
        },
        fixed: {
          kind: 'fixed',
          focus: 'right',
          title: '固定操作列',
          description: '固定列背景、hover/current 颜色由 HYN 样式保证，页面不要 deep 覆盖。',
          code: `{'{'} key: 'action', label: t('app.common.action'), align: 'center', fixed: 'right', actions: rowActions {'}'}`
        },
        height: {
          kind: 'height',
          focus: 'scroll',
          title: '弹窗或内联表格高度',
          description: '普通页面不传高度；弹窗或内联编辑表需要稳定滚动边界时传 maxHeight。',
          code: `<hyn-table :rows="rows" :columns="columns" :row-key="getRowKey" max-height="420px" />`
        }
      }
    },
    reference: {
      kicker: '参考',
      title: '字段说明',
      description: '首期 API 保持小而稳定，优先覆盖普通 CRUD 真实高频用法。',
      aria: 'HynTable API',
      columns: {
        field: '字段',
        type: '类型',
        description: '说明'
      },
      rows: {
        rows: '当前页行数据，普通分页由业务页继续配合 pagination 使用。',
        columns: '列配置，使用 label、prop、type、slot、formatter、actions 表达展示逻辑。',
        rowKey: '稳定行主键，用于选择状态、当前行和 Element Plus reserve-selection。',
        selectedRowKeys: '受控选择主键，可通过 v-model:selected-row-keys 使用。',
        selection: '开启复选列，selection 是模板里更短的别名。',
        currentRowKey: '当前业务上下文行高亮。',
        height: '需要内部滚动时传入固定高度；普通页面可不传。',
        maxHeight: '需要保持最大高度但不固定空白高度时使用，适合内联编辑表或弹窗表格。',
        defaultSort: '后端排序列表的默认排序状态，可配合 useTableSortQuery 使用。',
        columnType: '日期列默认稳定宽度，操作列复用统一 action cell。',
        sortable: '透传 Element Plus 排序能力；后端排序使用 sortable: custom。',
        sortOrders: '自定义排序顺序，配合 sortable 使用。',
        overflowMode:
          '默认继承 `hynGlobalConfig.overflowMode`；列级配置优先覆盖。只有显式 ellipsis 才省略，并在真实溢出时显示 tooltip。',
        actions: '可作为 props 追加右侧操作列，也可写在 columns 中。'
      }
    },
    visual: {
      kicker: '视觉契约',
      title: '表格视觉契约',
      description: 'HynTable、HynVirtualTable 和 HynVirtualTreeTable 的用户可见表格体验必须一致。',
      items: {
        row: {
          kind: 'Row',
          title: '行高和 hover',
          description: '普通表、虚拟表、树表必须使用相同字号、行高、hover 和 current row 颜色。'
        },
        overflow: {
          kind: 'Overflow',
          title: '溢出策略',
          description: '默认完整显示，只有显式 ellipsis 的内容才省略并在真实溢出时显示 tooltip。'
        },
        actions: {
          kind: 'Actions',
          title: '统一按钮',
          description: '操作列必须复用 HynTableActionCell，按钮尺寸、间距、权限、禁用态一致。'
        },
        fixed: {
          kind: 'Fixed',
          title: '固定列背景',
          description: '横向滚动时固定操作列背景不能透底，边框和阴影必须保持稳定。'
        },
        empty: {
          kind: 'Empty',
          title: '空态和 loading',
          description: '空数据、loading、分页位置跟现有 data-table 视觉协议一致。'
        },
        slot: {
          kind: 'Slot',
          title: 'slot 不破坏协议',
          description: '自定义列要继承单元格内边距、单行展示和溢出策略。'
        }
      }
    },
    rules: {
      kicker: 'Do / Don’t',
      title: 'AI 生成规则',
      description: '普通表格迁移时要保留权限、导出、分页、排序、slot 和选择状态，不只替换标签名。',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        overflow: '文本列默认依赖 HYN 溢出策略，不逐列手写 tooltip。',
        date: "时间列用 `type: 'date'` 或显式稳定宽度。",
        actions: '操作列用 `actions`，权限写 `permissions`，禁用态写 `disabled`。',
        slot: 'slot 列如果单行省略，必须显式声明 ellipsis 策略。'
      },
      dontItems: {
        rawTable: '不要新增普通 CRUD 主表裸 `el-table`。',
        deepStyles: '不要在业务页 deep 覆盖 HYN 表头、行高、固定列背景。',
        largeLogs: '不要把几千行日志列表硬塞给普通 HynTable。',
        slotVisual: '不要为了 slot 展示破坏 `.data-table` 的单元格视觉协议。'
      }
    }
  },
  tableDialog: {
    hero: {
      kicker: '反馈 / 数据工作流',
      title: 'HynTableDialog',
      description:
        '面向日志、审计、授权、选择器等“筛选 + 批量操作 + 表格 + 分页”弹窗。它只负责弹窗壳和区域协议，表格内容通过具名插槽接入，避免业务页复用主页面 toolbar 样式。',
      pills: {
        filters: 'filters slot',
        actions: 'action row',
        table: 'table viewport',
        pagination: 'pagination slot'
      }
    },
    metrics: {
      defaultWidth: {
        label: '默认宽度',
        value: '1120px',
        note: '默认使用 min(1120px, calc(100vw - 32px))，避免 90% 大弹窗失控。'
      },
      layout: {
        label: '布局',
        value: '纵向',
        note: '筛选、操作、表格和分页各自占位，表格区域吃剩余高度。'
      },
      useCase: {
        label: '使用场景',
        value: '表格弹窗',
        note: '日志、审计、授权和选择器类列表弹窗。'
      }
    },
    live: {
      kicker: '实时示例',
      title: '日志表格弹窗',
      description: '示例展示筛选区、批量操作、普通分页表格和分页区域的标准组合。',
      openButton: '打开表格弹窗',
      dialogTitle: '调度日志',
      jobName: '任务名称',
      jobNamePlaceholder: '请输入任务名称',
      status: '执行状态',
      statusPlaceholder: '请选择执行状态',
      success: '成功',
      failure: '失败',
      search: '搜索',
      reset: '重置',
      delete: '删除',
      export: '导出',
      emptyText: '暂无日志数据',
      columns: {
        id: '日志编号',
        jobName: '任务名称',
        invokeTarget: '调用目标字符串',
        status: '执行状态',
        createTime: '执行时间',
        action: '操作',
        detail: '详情'
      },
      demoJob: {
        systemDefault: '系统默认',
        dataSync: '数据同步'
      }
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '标准表格弹窗模板',
      description: '日志、审计和授权弹窗复制这个结构；普通新增编辑仍使用 HynDialog + fields。',
      codeTitle: 'HynTableDialog',
      code: `<hyn-table-dialog
  v-model="logDialog.visible"
  title="调度日志"
  width="min(1240px, calc(100vw - 48px))"
  :loading="logLoading"
  :total="logTotal"
  :selected-count="selectedLogRowKeys.length"
>
  <template #filters>
    <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
      <!-- 查询字段 -->
    </el-form>
  </template>

  <template #actions>
    <el-button type="danger" plain icon="Delete" :disabled="selectedLogRowKeys.length === 0">删除</el-button>
    <el-button type="warning" plain icon="Download">导出</el-button>
  </template>

  <template #table>
    <hyn-table
      v-model:selected-row-keys="selectedLogRowKeys"
      :rows="rows"
      :columns="columns"
      :row-key="getRowKey"
      selection
    />
  </template>

  <template #pagination>
    <pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" :total="logTotal" />
  </template>
</hyn-table-dialog>`
    },
    reference: {
      kicker: '参考',
      title: '组件 API',
      description: '组件只定义区域协议，不接管业务查询、选择和分页数据流。',
      aria: 'HynTableDialog API',
      columns: {
        field: '字段',
        type: '类型',
        description: '说明'
      },
      rows: {
        model: '控制弹窗显示隐藏。',
        title: '弹窗标题，建议使用业务对象名称。',
        width: '弹窗宽度，默认 min(1120px, calc(100vw - 32px))。',
        loading: '整块表格弹窗 loading，用于刷新期间屏蔽重复操作。',
        totals: '摘要区默认展示总数和已选数量，也会透传给 actions、summary、footer slot。',
        showFooter: '默认 false；需要确认/取消闭环的选择器弹窗可开启。',
        filters: '筛选表单区域，通常放 query-form。',
        summary: '自定义摘要区域，参数包含 total、selectedCount、loading。',
        actions: '批量操作按钮区域，不复用主页面 toolbar-actions。',
        table: '表格视口区域。后端分页和小页默认放 HynTable，前端驻留大列表才放 HynVirtualTable。',
        pagination: '分页区域，建议直接放项目 pagination 组件。',
        footer: '覆盖默认 footer，开启 showFooter 后生效。'
      }
    },
    rules: {
      kicker: 'Do / Don’t',
      title: '边界规则',
      description: '表格弹窗的价值是收敛布局协议，不是把业务逻辑塞进全局组件。',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        listDialogs: '日志、审计、授权、选择器等列表弹窗使用 HynTableDialog。',
        queryForm: '`#filters` 内继续使用项目统一 `query-form`。',
        tableSlot: '`#table` 默认接入 HynTable；只有前端驻留大列表才切换 HynVirtualTable。',
        selectedKeys: '选中主键由业务页受控，批量按钮从 selectedCount 或本地 computed 派生。'
      },
      dontItems: {
        nestedDialog: '不要用 HynDialog 裹 slot 拼日志、审计这类表格弹窗。',
        toolbarActions: '不要在弹窗里复用主页面 `.toolbar-actions`。',
        overrideStyles: '不要在业务页覆盖 `.hyn-table-dialog`、`.hyn-table` 或 `.data-table` 全局协议。',
        formMigration: '不要把新增、编辑表单迁移到 HynTableDialog。'
      }
    }
  },
  virtualTable: {
    hero: {
      kicker: '数据展示',
      title: 'HynVirtualTable',
      description:
        '面向大数据平铺列表、授权弹窗、日志和审计表。它只渲染视口附近行，减少大量 DOM 带来的滚动和切换成本，视觉上必须继续对齐普通 HynTable。',
      pills: {
        virtualScroll: '虚拟滚动',
        flatLargeData: '平铺大数据',
        crossPageSelection: '跨页选择',
        visualProtocol: '统一视觉协议'
      }
    },
    metrics: {
      rendering: {
        label: '渲染方式',
        value: 'Virtual',
        note: '基于 TanStack Virtual，只渲染视口附近行。'
      },
      rowHeight: {
        label: '默认行高',
        value: '48px',
        note: '必须和普通表、树表的视觉行高保持一致。'
      },
      useCase: {
        label: '适用场景',
        value: 'Large',
        note: '授权弹窗、日志、审计和实体选择等大数据平铺场景。'
      }
    },
    live: {
      kicker: '实时示例',
      title: '大数据平铺表示例',
      description: '示例保留最多 5000 行数据，DOM 行数由视口和 overscan 决定，不随总行数线性增长。',
      emptyText: '暂无虚拟表数据',
      columns: {
        id: '编号',
        userName: '用户名称',
        roleName: '角色名称',
        status: '状态',
        remark: '说明',
        action: '操作'
      },
      actions: {
        edit: '修改',
        delete: '删除'
      },
      demoRow: {
        userName: '演示用户 {index}',
        adminRole: '系统管理员',
        userRole: '普通角色',
        normal: '正常',
        disabled: '停用',
        remark: '第 {index} 行虚拟表数据，用于验证滚动、tooltip 和操作列视觉。'
      }
    },
    howTo: {
      kicker: '使用方法',
      title: '基础用法',
      description: '虚拟表沿用虚拟列协议 `title/field`，避免和普通 HynTable 的 `label/prop` 混用。',
      boundaryTitle: '使用边界',
      boundaryDescription:
        '只有用户可感知的平铺大数据场景才使用 HynVirtualTable。不要把排序、合并单元格、复杂原生 table 能力硬塞进虚拟表；普通分页 CRUD 默认回到 HynTable。',
      codeTitle: 'Vue 模板',
      code: `<hyn-virtual-table
  v-model:selected-row-keys="selectedUserKeys"
  :rows="userRows"
  :columns="userTableColumns"
  :row-key="getUserRowKey"
  :visible-row-count="10"
  selection
  empty-text="暂无用户数据"
  {'@'}selection-change="handleUserSelectionChange"
/>

const userTableColumns: HynVirtualTableColumn<UserVO>[] = [
  {'{'} key: 'userName', title: '用户名称', field: 'userName', minWidth: 180 {'}'},
  {'{'} key: 'nickName', title: '用户昵称', field: 'nickName', minWidth: 160 {'}'},
  {'{'} key: 'status', title: '状态', field: 'status', width: 100, align: 'center', slot: 'status' {'}'}
];`
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '虚拟表标准模板',
      description: '授权弹窗、审计日志、实体候选等前端驻留的大数据平铺场景复制这个模式。',
      codeTitle: 'HynVirtualTable 模板',
      code: `<hyn-virtual-table
  ref="tableRef"
  v-model:selected-row-keys="selectedUserKeys"
  :rows="userRows"
  :columns="userTableColumns"
  :row-key="getUserRowKey"
  :visible-row-count="10"
  :row-height="48"
  :overscan="12"
  selection
  empty-text="暂无用户数据"
  {'@'}selection-change="handleUserSelectionChange"
  {'@'}select-all-change="handleSelectAllChange"
/>

const userTableColumns: HynVirtualTableColumn<UserVO>[] = [
  {'{'} key: 'userName', title: '用户名称', field: 'userName', minWidth: 180 {'}'},
  {'{'} key: 'nickName', title: '用户昵称', field: 'nickName', minWidth: 160 {'}'},
  {'{'} key: 'phonenumber', title: '手机号码', field: 'phonenumber', minWidth: 150 {'}'},
  {'{'} key: 'status', title: '状态', field: 'status', width: 100, align: 'center', slot: 'status' {'}'},
  {'{'}
    key: 'action',
    title: '操作',
    sticky: 'right',
    align: 'center',
    actions: [
      {'{'} key: 'edit', label: '修改', icon: Edit, permissions: ['system:user:edit'], onClick: handleUpdate {'}'}
    ]
  {'}'}
];`
    },
    recipes: {
      kicker: 'Recipes',
      title: '性能和交互 recipes',
      description: '虚拟表的列宽、行高、rowKey 必须稳定，否则滚动测量会抖。',
      items: {
        rowKey: {
          kind: 'rowKey',
          focus: 'required',
          title: '稳定主键',
          description: '虚拟行复用、选择状态和滚动定位都依赖稳定 key。',
          code: `const getUserRowKey = (row: UserVO): HynVirtualTableKey => {'{'}
  return row.userId;
{'}'};`
        },
        height: {
          kind: 'height',
          focus: '10 rows',
          title: '稳定 viewport',
          description: '普通场景默认显示 10 行；弹窗、详情或嵌入容器可用 visibleRowCount 或 height 调整。',
          code: `<hyn-virtual-table :visible-row-count="8" :row-height="48" :overscan="12" />`
        },
        selection: {
          kind: 'selection',
          focus: 'controlled',
          title: '受控选择',
          description: '用 selectedRowKeys 保存选择主键，不把选择状态绑死在 DOM 行上。',
          code: `<hyn-virtual-table
  v-model:selected-row-keys="selectedRowKeys"
  selection
  {'@'}selection-change="handleSelectionChange"
  {'@'}select-all-change="handleSelectAllChange"
/>`
        },
        actions: {
          kind: 'actions',
          focus: 'shared cell',
          title: '统一操作列',
          description: '虚拟表操作列同样使用 HYN action cell，保证和普通表格一致。',
          code: `{'{'}
  key: 'action',
  title: '操作',
  sticky: 'right',
  align: 'center',
  actions: [
    {'{'} key: 'edit', label: '修改', icon: Edit, permissions: ['system:user:edit'], onClick: handleUpdate {'}'}
  ]
{'}'}`
        }
      }
    },
    reference: {
      kicker: '参考',
      title: '字段说明',
      description: '虚拟表 API 服务性能场景，列宽和行高要稳定，避免滚动时测量抖动。',
      aria: 'HynVirtualTable API',
      columns: {
        field: '字段',
        type: '类型',
        description: '说明'
      },
      rows: {
        rows: '大数据平铺行数据，DOM 渲染量由视口高度和 overscan 决定。',
        columns: '虚拟表列配置，使用 title、field、width、minWidth、slot、actions。',
        rowKey: '稳定主键，用于虚拟行复用、选择状态和当前行判断。',
        visibleRowCount: '默认可见行数，默认 10；父容器没有固定高度时用它生成稳定 viewport。',
        height: '显式表格高度，传入后优先于 visibleRowCount；需要填满父容器时可传 100%。',
        rowHeight: '虚拟行预估高度，默认 48，必须与视觉行高接近。',
        overscan: '视口外额外渲染行数，越大滚动越稳但 DOM 越多。',
        selection: '开启选择列和多选能力，禁用行通过 rowDisabled 控制。',
        fit: '默认开启，列宽参与剩余空间分配；关闭后按列宽总和渲染横向滚动。',
        actions: '复用 HYN 统一操作列按钮，不在业务页手写按钮样式。'
      }
    },
    rules: {
      kicker: 'Do / Don’t',
      title: '使用边界',
      description: '虚拟表解决大量 DOM 的滚动成本，不是普通表格的万能替代品。',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        largeLists: '用于几百行以上平铺列表、授权弹窗、日志审计和实体选择。',
        rowKey: '总是提供稳定 rowKey，不要用数组索引。',
        widths: '列宽使用 width/minWidth，操作列使用 actions。',
        measure: '大数据切换或容器尺寸变化后调用 expose 的 measure() 重新测量。'
      },
      dontItems: {
        pagedCrud: '不要把普通分页 CRUD 默认改成虚拟表。',
        nativeTableFeatures: '不要硬塞排序、合并单元格、复杂原生 table 能力。',
        dynamicHeight: '不要让行高随内容变化，否则虚拟滚动体验会抖。',
        customActionStyles: '不要在页面里手写操作列按钮样式。'
      }
    }
  },
  virtualTreeTable: {
    hero: {
      kicker: '数据展示',
      title: 'HynVirtualTreeTable',
      description:
        '面向部门、组织、区域、分类、权限等大树场景。它只渲染视口附近行，展开状态和懒加载状态由 useHynVirtualTreeTable 管理，避免业务页堆叠树算法和大量 DOM。',
      pills: {
        virtualScroll: '虚拟滚动',
        treeIndex: '树索引',
        lazyLoading: '懒加载',
        innerScroll: '内部滚动'
      }
    },
    metrics: {
      realDom: {
        label: '真实 DOM',
        value: '视口 + overscan',
        note: '展开节点数量不会线性增加 DOM。'
      },
      expansionState: {
        label: '展开状态',
        value: 'Set',
        note: '展开 key 独立维护，离场成本低。'
      },
      dataMode: {
        label: '数据模式',
        value: 'Full / Lazy',
        note: '按后端能力选择全量或懒加载。'
      }
    },
    live: {
      kicker: '实时示例',
      title: '运行示例',
      description: '展开一级不会创建全量 DOM，真实 DOM 行数仍由视口高度和 overscan 决定。',
      selectedCount: '当前已选 {count} 个可操作节点。',
      expandRootLevel: '展开一级',
      collapseAll: '收起全部',
      emptyText: '暂无组织数据',
      columns: {
        name: '组织名称',
        owner: '负责人'
      },
      status: {
        enabled: '启用',
        disabled: '停用'
      },
      owners: {
        platform: '平台组',
        frontend: '前端组',
        delivery: '交付组',
        experience: '体验组',
        architecture: '架构组',
        operations: '运营组',
        regionOne: '区域一组',
        data: '数据组'
      },
      rows: {
        root: { name: '总部组织' },
        rdCenter: { name: '研发中心' },
        deliveryCenter: { name: '交付中心' },
        componentPlatform: { name: '组件平台' },
        performanceGovernance: { name: '性能治理' },
        regionalOrg: { name: '区域组织' },
        eastChina: { name: '华东区域' },
        archive: { name: '历史归档' }
      }
    },
    howTo: {
      kicker: 'How-to',
      title: '基础用法',
      description: '模板只绑定 hook 返回的可见行，列配置里把树主列标记为 tree: true。',
      templateTitle: '模板',
      templateDescription: 'rows 必须是 visibleRows，不要传后端原始数组。toggle-row 通常直接绑定 hook 的 toggleRow。',
      templateCodeTitle: 'Vue Template',
      hookTitle: 'Hook',
      hookDescription: 'getRowKey 和 getParentKey 是树索引核心。batchSize 控制批量展开时每帧处理多少根节点。',
      hookCodeTitle: 'Composition API'
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '树表标准模板',
      description: '部门、组织、权限树表优先复制这个组合：组件只渲染可见行，hook 管树索引和展开状态。',
      codeTitle: 'HynVirtualTreeTable + hook'
    },
    reference: {
      kicker: '参考',
      title: '组件 API',
      description: '组件 API 保持少而稳定，复杂状态集中在 hook。',
      aria: 'HynVirtualTreeTable API',
      columns: {
        field: '字段',
        type: '类型',
        description: '说明'
      },
      rows: {
        rows: 'hook 返回的可见行，不是后端原始数组。',
        columns: '列配置，树形主列必须设置 tree: true。',
        actions: '推荐的标准操作区配置，组件内置 Element Plus Tooltip/Button 和权限判断。',
        width: '特殊操作列宽度可显式配置；默认由 actions.length 自动推导。',
        loading: '首次查询或全表刷新加载态；空数据加载时显示骨架屏。',
        busy: '批量展开、分帧任务等非接口主加载态。',
        busyText: '顶部细进度条旁的任务说明，例如“正在展开一级 60%”。',
        progress: '0 到 1 的进度值，用于顶部细进度条。',
        visibleRowCount:
          '默认可见行数，默认 10；父容器没有固定高度时用它生成稳定 viewport，避免展开后一次渲染全部可见行。',
        height: '显式树表高度，传入后优先于 visibleRowCount；标准 table-panel 可继续由页面壳控制 100% 高度。',
        rowHeight: '虚拟行预估高度，默认 48，必须与视觉行高接近。',
        overscan: '视口外额外渲染行数，默认 12，越大滚动越稳但 DOM 越多。',
        selectedRowKeys: '受控选择主键，可通过 v-model:selected-row-keys 使用；祖先半选态只用于视觉，不写入该数组。',
        selection: '开启树列内选择框和多选能力；单选场景传 multiple=false。',
        rowDisabled: '按业务行禁用选择，禁用行不会参与表头批量选择。',
        selectionChange: '单行选择变化时触发，返回当前行、选中状态和全部已选主键。',
        selectAllChange: '多选表头选择变化时触发，只作用于当前可见且未禁用的树行。',
        toggleRow: '点击展开按钮时触发，通常直接绑定 hook 的 toggleRow。'
      }
    },
    visual: {
      kicker: '视觉契约',
      title: '表格视觉契约',
      description: 'HynVirtualTreeTable 必须和 HynTable、HynVirtualTable 保持一致的用户可见表格体验。',
      items: {
        rows: {
          kind: 'Rows',
          title: '统一行高',
          description: '普通表、虚拟表和虚拟树表行高、字体、hover、current 背景保持一致。'
        },
        actions: {
          kind: 'Actions',
          title: '统一操作列',
          description: '树表操作按钮继续复用 HynTableActionCell，不在页面内手写按钮尺寸和 tooltip。'
        },
        selection: {
          kind: 'Selection',
          title: '树列选择',
          description:
            '选择框属于树主列，放在展开按钮右侧；选中态由 selectedRowKeys 主键驱动，可见祖先随子节点选中展示半选态。'
        },
        fixed: {
          kind: 'Fixed',
          title: '固定列不透底',
          description: '横向滚动时 sticky 操作列必须有稳定背景，并继承 hover 与选中态。'
        },
        tooltip: {
          kind: 'Tooltip',
          title: '省略有提示',
          description: '树主列和普通文本列被省略时要保留 tooltip 策略，未溢出内容不弹无意义提示。'
        }
      }
    },
    lazy: {
      kicker: 'Lazy Loading',
      title: '懒加载配置',
      description: '懒加载解决的是接口传输体和前端内存，不只是减少 DOM。不传 lazy 时保持全量模式。',
      conditionsTitle: '启用条件',
      conditionsDescription: '后端必须能返回子节点标记，并提供按父节点查询直接子节点的接口。',
      codeTitle: 'Lazy Hook',
      aria: 'lazy 配置说明',
      rows: {
        lazy: '不传时保持全量模式；传入时启用点击父节点后加载子节点。',
        hasChildren: '常映射 hasChildren、childCount > 0、leaf === false。',
        loadChildren: '点击展开时调用，必须返回当前节点的直接子节点数组。',
        loadedKeys: 'hook 内部维护，节点加载成功后记录，避免重复请求同一父节点。',
        loadingKeys: 'hook 内部维护，当前正在加载的节点显示行内转圈状态。',
        loadErrorByKey: 'hook 内部维护，加载失败会显示“加载失败”，完整错误在 title 中。'
      }
    },
    backend: {
      kicker: 'Backend Contract',
      title: '后端返回契约',
      description: '全量模式一次性返回所有节点；懒加载模式根接口和子接口分开，子接口只返回当前父节点的直接子节点。',
      fullTitle: '全量模式',
      fullDescription: '适合几百到几千节点。前端通过 deptId / parentId 构建树。',
      fullCodeTitle: 'GET /system/dept/list',
      lazyTitle: '懒加载模式',
      lazyDescription: '适合几千到几万节点。父节点必须携带 hasChildren 或等价字段。',
      lazyCodeTitle: 'GET /system/dept/children?parentId=100'
    },
    rules: {
      kicker: 'Do / Don’t',
      title: '树表生成规则',
      description: '树表的关键不是组件标签，而是可见行、稳定父子 key 和懒加载失败状态。',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        hook: '列表 API 返回数组时优先用 `useHynVirtualTreeTable` 构建可见行。',
        treeColumn: '树主列必须设置 `tree: true`。',
        selectionKeys: '选择状态用 `v-model:selected-row-keys` 保存主键。',
        lazyState: '懒加载必须保留 loading、loaded、error 状态。',
        actions: '操作列继续使用 `actions`，不要手写按钮样式。'
      },
      dontItems: {
        rawTreeTable: '不要生成 `el-table tree-props + default-expand-all` 作为默认方案。',
        indexKey: '不要用数组索引当 row key 或 parent key。',
        selectionColumn: '不要为树表选择生成最左独立选择列。',
        expandThousands: '不要默认展开几千节点。',
        swallowLazyError: '不要静默吞掉懒加载接口失败。',
        guessBackendNames: '不要从部门、组织、区域等后端名称猜英文；真实业务树必须由后端提供 key 或 localized 字段。'
      }
    }
  },
  treeSelect: {
    hero: {
      kicker: '数据录入 / 树选择',
      title: 'HynTreeSelect',
      description:
        'HynTreeSelect 是通用树选择字段，承接层级树选择和虚拟平铺选择。业务专属数据源继续放在业务适配组件里，例如部门字段由 HynDeptSelect 加载部门树。',
      pills: {
        treeMode: '层级树',
        flatMode: '虚拟平铺',
        localSearch: '本地搜索',
        formField: 'HynForm field'
      }
    },
    live: {
      kicker: '实时示例',
      title: '树形单选、多选和平铺多选',
      description: '同一份树数据可以通过 Tree V2 保留层级结构，也可以通过 flatten 展示为 Select V2 虚拟平铺列表。',
      fields: {
        parentId: '上级节点',
        nodeIds: '父子独立',
        linkedNodeIds: '父子联动',
        flatNodeIds: '平铺多选'
      },
      placeholders: {
        parentId: '请选择上级节点',
        nodeIds: '请选择节点',
        linkedNodeIds: '请选择节点',
        flatNodeIds: '请选择节点'
      },
      nodes: {
        root: '平台节点',
        childA: '门户菜单',
        childB: '控制台菜单',
        group: '业务节点',
        childC: '审批中心'
      }
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '字段配置',
      description:
        '普通配置化表单里的通用树字段使用 treeSelect。部门字段仍优先使用 deptSelect，远程分页实体仍使用 remoteSelect。',
      codeTitle: 'HynForm treeSelect field',
      code: `const fields = computed<HynFormField<FormModel>[]>(() => [
  {'{'}
    key: 'parentId',
    label: t('app.example.field.parent'),
    prop: 'parentId',
    type: 'treeSelect',
    data: treeOptions.value,
    props: {'{'} value: 'id', label: 'label', children: 'children' {'}'},
    valueKey: 'id',
    linkage: false
  {'}'},
  {'{'}
    key: 'nodeIds',
    label: t('app.example.field.nodes'),
    prop: 'nodeIds',
    type: 'treeSelect',
    data: treeOptions.value,
    props: {'{'} value: 'id', label: 'label', children: 'children' {'}'},
    valueKey: 'id',
    multiple: true,
    dropdownWidth: 420,
    linkage: true
  {'}'},
  {'{'}
    key: 'flatNodeIds',
    label: t('app.example.field.flatNodes'),
    prop: 'flatNodeIds',
    type: 'treeSelect',
    data: treeOptions.value,
    props: {'{'} value: 'id', label: 'label', children: 'children' {'}'},
    valueKey: 'id',
    multiple: true,
    linkage: false,
    flatten: true
  {'}'}
]);`
    },
    reference: {
      kicker: '参考',
      title: '字段 API',
      description:
        '`treeSelect` 是通用树选择协议；层级模式统一使用 Tree V2，`flatten: true` 使用 Select V2 虚拟平铺列表和前端本地搜索。',
      aria: 'HynTreeSelect 字段 API',
      columns: {
        field: '字段',
        type: '类型',
        description: '说明'
      },
      rows: {
        data: '树节点数据，由调用方持有。业务专属接口加载不写进 HynTreeSelect。',
        props: '字段映射，支持 value、label、children、disabled。',
        multiple: '为 true 时树形模式展示复选框并写回节点主键数组。',
        linkage:
          '设置树形多选的初始联动状态；开启时已选父节点级联全部后代，关闭时保留真实 checkedKeys 并清理半选缓存。',
        onLinkageChange: '联动按钮切换后的回调；当后端还需要严格模式字段时，在这里同步写回表单模型。',
        flatten: '为 true 时改用虚拟平铺列表，适合大树多选和父子独立选择；平铺索引会分帧构建，避免弹窗首开卡顿。',
        filterable: '允许关键字过滤；树形模式走 Tree V2 本地过滤，平铺模式基于已加载数据在前端分帧过滤。',
        filterDisabled: '为 true 时过滤 disabled 节点。',
        dropdownWidth: '控制树形 Tree V2 下拉宽度；平铺 Select V2 模式仍跟随控件宽度。',
        loading: '外部加载态；异步树数据加载期间下拉展示 loading 文案。'
      }
    },
    rules: {
      kicker: '规则',
      title: '使用边界',
      description: 'HynTreeSelect 只负责树数据的选择展示，不负责业务接口、分页实体回显或权限树编辑。',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        genericTree: '通用菜单、分类、区域等已加载树字段使用 treeSelect。',
        flatten: '需要层级上下文时使用默认树形模式；需要无层级歧义的父子独立大树多选时使用 flatten。',
        deptWrapper: '系统部门字段使用 deptSelect，让部门接口和缓存留在业务适配层。'
      },
      dontItems: {
        remoteEntity: '不要把用户、角色、岗位等远程分页实体塞进 treeSelect。',
        backendFetch: '不要让 HynTreeSelect 直接知道业务接口路径。',
        permissionEditor: '不要用普通树下拉替代权限树编辑器。'
      }
    },
    acceptance: {
      kicker: '验收',
      title: '验证清单',
      description: '修改树选择能力或新增通用树字段时检查这些点。',
      items: {
        tree: '树形模式统一使用 Tree V2，保留层级结构、linkage、dropdownWidth 和下拉最大高度。',
        flat: 'flatten 模式使用虚拟平铺列表，搜索不请求后端，输入过滤不长时间阻塞主线程。',
        loading: '异步数据加载期间有 loading 反馈，不出现空白无响应。',
        types: '业务树 VO 可以直接传入，不要求额外索引签名或页面转换。'
      }
    }
  },
  deptSelect: {
    hero: {
      kicker: '数据录入 / 部门字段',
      title: 'HynDeptSelect',
      description:
        "HynDeptSelect 统一系统部门树下拉框。HynForm 和 HynDialog 通过 `type: 'deptSelect'` 消费它，页面只声明字段配置，不再重复维护部门树加载逻辑。",
      pills: {
        formField: 'HynForm field',
        singleMulti: '单选 / 多选',
        disabledFilter: '禁用过滤',
        typedConfig: '类型化配置'
      }
    },
    live: {
      kicker: '实时示例',
      title: '单选、树形多选和平铺多选',
      description:
        '同一个字段类型支持单值单选、Tree V2 树形多选和 Select V2 平铺多选。部门名称来自后端部门树，前端按原值展示。',
      fields: {
        deptId: '部门',
        deptIds: '部门联动',
        flatDeptIds: '部门平铺'
      },
      placeholders: {
        deptId: '请选择部门',
        deptIds: '请选择部门',
        flatDeptIds: '请选择部门'
      }
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '字段配置',
      description: 'HynDialog 或 HynForm 里需要系统部门下拉框时，使用这个字段。',
      codeTitle: 'HynDialog 部门字段',
      code: `const fields = computed<HynDialogField<RoleForm>[]>(() => [
  {'{'}
    key: 'deptId',
    label: t('app.systemRole.field.dept'),
    prop: 'deptId',
    type: 'deptSelect',
    placeholder: t('app.systemRole.placeholder.dept')
  {'}'},
  {'{'}
    key: 'deptIds',
    label: t('app.systemRole.field.dept'),
    prop: 'deptIds',
    type: 'deptSelect',
    multiple: true,
    linkage: true,
    dropdownWidth: 420
  {'}'},
  {'{'}
    key: 'flatDeptIds',
    label: t('app.systemRole.field.dept'),
    prop: 'flatDeptIds',
    type: 'deptSelect',
    multiple: true,
    flatten: true
  {'}'}
]);`
    },
    reference: {
      kicker: '参考',
      title: '字段 API',
      description:
        '`deptSelect` 是类型化 HynForm 字段。它内部持有 `/system/user/deptTree` 数据源，只暴露表单层需要的行为开关。',
      aria: 'HynDeptSelect 字段 API',
      columns: {
        field: '字段',
        type: '类型',
        description: '说明'
      },
      rows: {
        type: '在 HynForm 和 HynDialog 内启用部门选择 renderer。',
        multiple: '为 true 时字段写回部门主键数组；树形模式展示 Tree V2 复选框。',
        flatten:
          '为 true 时使用 Select V2 虚拟平铺列表展示部门，并基于已缓存部门数据执行前端本地搜索，适合父子不联动且需要避免层级选择歧义的多选字段；平铺索引和搜索都会分帧处理。',
        filterDisabled: '默认过滤后端标记为 disabled 的部门节点；只有业务表单必须展示禁用部门时才设为 false。',
        linkage: '设置树形多选的初始部门联动状态；开启时已选父部门级联全部后代，关闭时保留真实勾选部门主键。',
        onLinkageChange: '联动按钮切换后的回调；用于把界面模式同步到角色等业务表单的严格模式字段。',
        filterable: '允许在已加载的部门树里按关键字本地过滤。',
        clearable: '展示清空按钮，并按单选或多选模式写回空值。',
        collapseTags: '多选时折叠 tag，保持表单行高稳定。',
        maxCollapseTags: '控制折叠前保留展示的 tag 数。',
        dropdownWidth: '控制树形 Tree V2 部门下拉宽度；平铺 Select V2 模式仍跟随控件宽度。',
        teleported: '控制下拉层是否传送到 body。'
      }
    },
    rules: {
      kicker: '规则',
      title: '使用边界',
      description: '这个选择器用于普通表单里的系统部门字段，不是通用树选择器，也不是权限树编辑器。',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        fieldType: "在 HynForm 或 HynDialog 字段数组里使用 `type: 'deptSelect'`。",
        multiple: '只有后端字段已确认为部门主键数组时，才使用 `multiple: true`。',
        disabled: '除非业务契约明确需要禁用部门，否则保持禁用节点过滤。'
      },
      dontItems: {
        pageTree: '不要每个页面都为了表单部门下拉重复加载 `/system/user/deptTree`。',
        componentProps: '不要为部门行为新增泛用 componentProps 逃生口。',
        guessLabels: '不要在前端翻译后端部门名称；按接口返回的 label 展示。'
      }
    },
    acceptance: {
      kicker: '验收',
      title: '验证清单',
      description: '修改部门选择器或新增表单用法时检查这些点。',
      items: {
        single: '单选写回一个部门主键，清空时写回 undefined。',
        multiple: '多选写回部门主键数组，并保持 tag 折叠。',
        flatten:
          '`flatten: true` 使用虚拟平铺下拉；默认树形模式使用 Tree V2。开启 `linkage` 会让已选父节点立即级联后代，关闭时保留真实勾选集合；两种切换都不改变展开状态。',
        disabled: '默认过滤禁用部门，且不会污染共享部门树缓存。',
        i18n: 'label 和 placeholder 仍来自页面或文档 i18n key；后端部门名继续作为业务数据原样展示。'
      }
    }
  },
  form: {
    hero: {
      kicker: '数据录入 / 表单协议',
      title: 'HynForm',
      description:
        'HynForm 不是 Element Plus Form 的替代品，而是项目标准表单协议：统一 label 宽度、字段栅格、控件宽度、select 多选 tag 对齐、数字输入框右侧按钮和错误滚动。普通表单只声明字段，页面不再散落表单 CSS。',
      pills: {
        schema: 'field schema',
        label: 'label contract',
        alignment: 'control alignment',
        expose: 'form expose'
      }
    },
    metrics: {
      scope: {
        label: 'Scope',
        value: 'Protocol',
        note: '只收敛项目表单协议，不重写 Element Plus 控件。'
      },
      dialog: {
        label: 'Dialog',
        value: 'Composed',
        note: 'HynDialog 内部组合 HynForm，共享字段配置协议。'
      },
      guard: {
        label: 'Guard',
        value: 'Linted',
        note: '危险 deep 覆盖和非公共弹窗表单 class 已纳入 lint 守卫。'
      }
    },
    live: {
      kicker: '实时示例',
      title: '标准表单协议',
      description: '重点观察 label 与控件垂直居中、多选首个 tag 不贴边、数字输入框右侧上下按钮保持半高结构和校验反馈。',
      ownerPlaceholder: '请选择负责人',
      ownerOptions: {
        platform: '平台管理员',
        business: '业务负责人'
      },
      validate: '校验',
      reset: '重置',
      validation: {
        idle: '未校验',
        passed: '校验通过',
        failed: '请补齐必填项'
      },
      fields: {
        appName: '应用名称',
        appCode: '应用编码',
        priority: '显示排序',
        status: '状态',
        tags: '标签',
        owner: '负责人',
        remark: '备注'
      },
      placeholders: {
        appName: '请输入应用名称',
        appCode: '请输入应用编码'
      },
      tooltips: {
        appCode: '编码保存后通常不建议随意修改。'
      },
      rules: {
        appName: '应用名称不能为空',
        appCode: '应用编码不能为空'
      },
      status: {
        enabled: '启用',
        disabled: '停用'
      },
      tags: {
        core: '核心系统',
        external: '外部接入',
        frequent: '高频操作'
      }
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '普通表单模板',
      description: '独立表单、抽屉表单、非弹窗配置表单复制这个结构；新增/编辑弹窗仍优先使用 HynDialog。',
      codeTitle: 'HynForm',
      code: `<script setup lang="ts">
import type {'{'} FormRules {'}'} from 'element-plus';
import type {'{'} HynFormField {'}'} from {'@'}/components/Hyn/types';

interface PostForm {'{'}
  postName: string;
  postCode: string;
  postSort: number;
  status: '0' | '1';
{'}'}

const form = ref<PostForm>({'{'} postName: '', postCode: '', postSort: 0, status: '0' {'}'});
const rules: FormRules<PostForm> = {'{'}
  postName: [ {'{'} required: true, message: t('app.system.post.rules.postName'), trigger: 'blur' {'}'} ]
{'}'};

const fields = computed<HynFormField<PostForm>[]>(() => [
  {'{'} key: 'postName', label: t('app.system.post.form.postName'), prop: 'postName', type: 'input', required: true {'}'},
  {'{'} key: 'postCode', label: t('app.system.post.form.postCode'), prop: 'postCode', type: 'input' {'}'},
  {'{'} key: 'postSort', label: t('app.system.post.form.postSort'), prop: 'postSort', type: 'number', min: 0 {'}'},
  {'{'}
    key: 'status',
    label: t('app.system.post.form.status'),
    prop: 'status',
    type: 'radio',
    options: [
      {'{'} label: t('app.common.normal'), value: '0' {'}'},
      {'{'} label: t('app.common.disabled'), value: '1' {'}'}
    ]
  {'}'}
]);
</script>

<template>
  <hyn-form :model="form" :fields="fields" :rules="rules" label-width="96px" :columns="2" />
</template>`
    },
    reference: {
      kicker: '参考',
      title: '组件 API',
      description: '字段类型复用 HynDialog 字段渲染能力，HynDialogField 是面向弹窗表单的公共类型。',
      aria: 'HynForm API',
      columns: {
        field: '字段',
        type: '类型',
        description: '说明'
      },
      rows: {
        model: '表单数据模型，由调用方持有。',
        fields: '字段配置数组，普通 label/value 表单的唯一布局入口。',
        rules: 'Element Plus 表单校验规则，字段 required 会自动补基础规则。',
        labelWidth: '统一 label 宽度，默认 96px。',
        columns: '表单列数，默认两列；移动端自动单列。',
        loading: '表单加载态，加载时字段统一禁用。',
        validate: '暴露给 HynDialog 或调用方的校验方法，失败时按配置滚动到首个错误字段。',
        getFormRef: '少数复杂场景访问底层 Element Plus Form 实例。'
      }
    },
    boundary: {
      kicker: '边界',
      title: '和 HynDialog 的边界',
      description: 'HynForm 负责表单协议，HynDialog 负责弹窗壳。复杂选项编辑器不要硬塞 fields。',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        dialogFields: '普通新增、编辑弹窗继续使用 HynDialog + fields，标准两列表单由 HynDialog 统一尺寸。',
        inlineForm: '非弹窗标准表单直接使用 HynForm。',
        singleColumn: '小型弹窗确需收窄时使用 columns=1，不要把两列表单压进窄弹窗。',
        complexSlot: '复杂区域用 HynForm slot 承载业务子组件，但不在页面 deep 覆盖 Element Plus。',
        specialEditor: 'Cron 这类选项编辑器抽成专属组件，radio label 和输入控件分离布局。'
      },
      dontItems: {
        extraClasses: '不要在页面新增 `.dialog-form`、`.dialog-grid-form`、`.permission-dialog-form`。',
        deepOverrides: '不要在页面写 `:deep(.el-form-item)` 或 `:deep(.el-input-number)`。',
        radioLayout: '不要把 radio 的 label 当作整行 flex 容器并塞入额外交互控件。',
        dialogCss: '不要为了一个页面把 HynDialog 再维护一套表单 CSS。'
      }
    },
    complexEditor: {
      kicker: '复杂编辑器',
      title: 'Cron 示例边界',
      description: '配置化字段适合 label/value 表单；Cron 可视化编辑器是行级选项编辑器，应使用专属组件。',
      codeTitle: 'Cron 可视化编辑器边界',
      code: `<hyn-dialog v-model="visible" title="Cron 表达式" width="900px" {'@'}confirm="confirmExpression">
  <div class="quartz-cron-dialog">
    <el-input v-model="draftExpression" />
    <quartz-cron-visual-editor
      v-model:active-tab="activeTab"
      :model="cronModel"
      :disabled="!visualEditable"
    />
  </div>
</hyn-dialog>

<!-- 关键点：
1. HynDialog 只做弹窗壳。
2. Cron 可视化编辑器不是普通 label/value 表单，不硬塞 HynForm fields。
3. radio 文案和 input/select 是 sibling，由专属组件行级布局控制。 -->`
    },
    acceptance: {
      kicker: '验收',
      title: '验收清单',
      description: '表单治理完成后按这些客观指标检查，不再依赖页面局部补丁。',
      visualTitle: '视觉验收',
      items: {
        labelCenter: 'label 与输入控件在 32px 控件高度内垂直居中。',
        selectTag: 'select 多选首个 tag 与左边框保持正常内边距。',
        inputNumber: 'input-number `controls-position="right"` 的上下按钮仍是半高结构。',
        responsive: '两列字段在窄屏自动收敛为单列，内容不重叠。'
      },
      codeTitle: 'Style Guard',
      code: `pnpm run lint:hyn-form

# 守卫会阻止新增：
src/views/** :deep(.el-form-item)
src/views/** :deep(.el-input-number)
src/views/** .dialog-form / .dialog-grid-form / .permission-dialog-form
src/views/** <el-dialog>`
    }
  },
  cronExpression: {
    hero: {
      kicker: '数据录入 / Cron 字段',
      title: 'HynCronExpression',
      description:
        'HynCronExpression 是 Quartz Cron 表达式字段组件。普通表单只把它当成一个轻量输入字段使用；可视化生成器、Cron 解析和执行时间预览不进入普通表单主路径，字段挂载后会在空闲期预加载。',
      pills: {
        formField: 'HynForm field',
        lazyDialog: 'lazy dialog',
        visualBuilder: 'visual builder',
        summaryChip: 'summary chip'
      }
    },
    metrics: {
      form: {
        label: 'Form',
        value: 'field',
        note: '表单只关心表达式字符串，不关心生成器内部状态。'
      },
      bundle: {
        label: 'Bundle',
        value: 'split',
        note: '生成器和 croner/cronstrue 保持独立 chunk，Cron 字段空闲预加载。'
      },
      scroll: {
        label: 'Scroll',
        value: 'single',
        note: '弹窗滚动由 HynDialog body 管理，内部区域不抢滚动。'
      }
    },
    live: {
      kicker: '实时示例',
      title: '表单内 Cron 字段',
      description: '字段本身只展示输入框和生成按钮；复杂编辑器在弹窗内部完成，不占普通表单布局。',
      demoJobName: '同步组织架构',
      fields: {
        jobName: '任务名称',
        cronExpression: 'Cron 表达式'
      }
    },
    aiCopy: {
      kicker: 'AI 复制块',
      title: '字段配置',
      description: "业务页不要再手写 Cron slot；普通新增/编辑弹窗通过 `type:'cron'` 接入全局组件。",
      codeTitle: 'HynForm cron field',
      code: `const fields = computed<HynFormField<JobForm>[]>(() => [
  {'{'} key: 'jobName', label: t('app.monitorJob.field.jobName'), prop: 'jobName', type: 'input' {'}'},
  {'{'}
    key: 'cronExpression',
    label: t('app.monitorJob.field.cronExpression'),
    prop: 'cronExpression',
    type: 'cron',
    span: 'full',
    contentLayout: 'inline'
  {'}'}
]);

const validateCronExpressionBeforeSubmit = async (): Promise<boolean> => {'{'}
  const {'{'} getQuartzCronSummary {'}'} = await import('{'@'}/components/Hyn/cron');
  const summary = getQuartzCronSummary(form.value.cronExpression);
  if (!summary.valid) {'{'}
    modal.msgError(summary.errorMessage ?? t('quartzCron.errors.invalid'));
    dialogRef.value?.scrollToField('cronExpression');
    return false;
  {'}'}
  form.value.cronExpression = summary.expression;
  return true;
{'}'};`
    },
    reference: {
      kicker: '参考',
      title: '字段配置说明',
      description: "`type:'cron'` 是表单字段协议，不是可视化编辑器协议；业务页只声明表达式字段和少量文案。",
      aria: 'HynCronExpression 字段配置说明',
      columns: {
        field: '字段',
        type: '类型',
        description: '说明'
      },
      rows: {
        key: '字段唯一标识，通常和 prop 保持一致。',
        label: 'HynForm 左侧 label，例如 Cron 表达式。',
        prop: '绑定模型字段，值必须是 Quartz Cron 表达式字符串。',
        type: '启用 HynCronExpression renderer；业务页不要改成 slot 手写。',
        span: 'Cron 字段建议使用 full，避免表达式输入框被两列挤压。',
        contentLayout: '推荐 inline，让输入框和按钮保持普通控件行语义。',
        placeholder: '覆盖输入框占位文案；不传时使用全局 i18n 默认值。',
        buttonText: '覆盖生成按钮文案；不传时使用全局“生成 / Generate”。',
        rules: '普通必填规则写在 HynForm rules；Quartz 语义校验提交前动态导入 getQuartzCronSummary。',
        disabled: '禁用字段时输入框和生成按钮都会禁用。'
      }
    },
    internals: {
      kicker: '内部实现',
      title: '内部组件职责',
      description:
        '这些组件是 HynCronExpression 的私有实现细节，业务页不要直接引用；文档列出它们是为了让人和 AI 后续维护时知道边界。',
      parts: {
        publicField: {
          layer: 'Public Field',
          name: 'index.vue',
          description: '表单内轻量输入组件，只负责 v-model、生成按钮、失焦规范空白和弹窗懒加载。',
          points: {
            model: '对外公开入口是 `<hyn-cron-expression>`。',
            asyncDialog: '弹窗组件通过 defineAsyncComponent 加载。',
            preload: 'hover、focus 和空闲期会复用同一个预加载 Promise。'
          }
        },
        dialogShell: {
          layer: 'Dialog Shell',
          name: 'HynCronExpressionDialog.vue',
          description: '使用 HynDialog 作为弹窗壳，负责解析外部表达式、同步可视化模型、展示生成结果和最近执行时间。',
          points: {
            hynDialog: '可视化区域和说明区域都不自建额外滚动。',
            rawMode: '高级表达式进入原始模式提示，不强行改写。',
            copyChip: '复制按钮保留在生成结果 chip 内。'
          }
        },
        visualBuilder: {
          layer: 'Visual Builder',
          name: 'HynCronVisualEditor.vue',
          description: 'Cron 可视化编辑器入口，组织秒、分、时、天、月、年 tab 和 Quartz 常用模式。',
          points: {
            sharedRows: '所有行走同一套三列协议。',
            dayTabs: '日规则和星期规则分组但仍共享行结构。',
            modelOnly: '只改 QuartzCronModel，不直接提交表单字段。'
          }
        },
        rowProtocol: {
          layer: 'Row Protocol',
          name: 'CronOptionRow.vue',
          description: '统一 radio、选项标题、参数区三列布局，整行点击只切换模式，参数控件不塞进 radio label。',
          points: {
            grid: '桌面端固定 24px / 156px / minmax(0, 1fr)。',
            active: 'active 行使用克制状态色和左侧细线。',
            mobile: '移动端折成 radio + 内容单列。'
          }
        },
        parameterControl: {
          layer: 'Parameter Control',
          name: 'CronNumberUnit / CronValuePicker',
          description: '数字单位和网格多选值的专用参数控件。',
          points: {
            shortLabels: '数字输入始终展示短标签和单位。',
            validRange: '清空数字时回到合法下限，避免生成 undefined。',
            controlWidth: 'picker 输出按 options 顺序排序，保证表达式稳定。'
          }
        },
        pureLogic: {
          layer: 'Pure Logic',
          name: 'cron.ts / quartzCron.ts',
          description: '公共 Cron helper 和纯 Quartz 模型生成、解析、说明、预览逻辑。',
          points: {
            publicImport: "业务提交前只从 `{'@'}/components/Hyn/cron` 导入 getQuartzCronSummary。",
            advancedMode: '高级合法表达式保持原始模式。',
            splitChunk: 'Croner/cronstrue 不进入普通表单主路径。'
          }
        }
      }
    },
    coreCode: {
      kicker: '关键代码',
      title: '关键代码',
      description: 'AI 需要改 Cron 时先看这三段：对外字段、弹窗懒加载、可视化行协议。不要从业务页复制旧 slot 写法。',
      fieldTypeTitle: 'Field type',
      fieldTypeCode: `export interface HynFormCronField<TModel extends object> extends HynFormModelField<TModel> {'{'}
  type: 'cron';
  placeholder?: string;
  buttonText?: string;
{'}'}`,
      lazyDialogTitle: 'Lazy dialog',
      lazyDialogCode: `type CronDialogModule = typeof import('./HynCronExpressionDialog.vue');

let cronDialogModulePromise: Promise<CronDialogModule> | undefined;

function loadCronDialogModule(): Promise<CronDialogModule> {'{'}
  if (!cronDialogModulePromise) {'{'}
    cronDialogModulePromise = import('./HynCronExpressionDialog.vue');
  {'}'}
  return cronDialogModulePromise;
{'}'}

const HynCronExpressionDialog = defineAsyncComponent(loadCronDialogModule);`,
      rowProtocolTitle: 'Visual row protocol',
      rowProtocolCode: `<cron-option-row
  value="interval"
  :title="t('quartzCron.simple.intervalLabel')"
  :active="model[tab.key].mode === 'interval'"
  :disabled="disabled"
  {'@'}select="setSimpleMode(tab.key, 'interval')"
>
  <cron-number-unit
    v-model="model[tab.key].intervalStep"
    label="间隔"
    unit="分钟"
  />
  <cron-number-unit
    v-model="model[tab.key].intervalStart"
    label="起始分钟"
    unit="分钟"
  />
</cron-option-row>`
    },
    boundary: {
      kicker: '边界',
      title: '为什么内部不用 HynForm',
      description:
        'Cron 秒、分、时、天配置是互斥选项编辑器，不是 label/value 表单；内部用专门行协议避免嵌套表单、重复 label 和滚动冲突。',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        formCron: "岗位、任务等普通表单使用 `type:'cron'`。",
        rowProtocol: '可视化行固定为 radio、选项标题、参数区三列。',
        shortLabels: '参数控件必须带短标签，例如“间隔 5 分钟”。',
        summaryValidation: '提交前动态导入 getQuartzCronSummary 做最终校验。',
        rawMode: '高级合法表达式保持解析兼容，不能可视化编辑时显示原始模式提示。'
      },
      dontItems: {
        businessSlot: '不要在业务页手写 Cron 输入框 append 按钮。',
        hynFormRows: '不要把 Cron 编辑器每一行包装成 HynForm 字段。',
        longSelect: '不要把“指定值”退回成长 el-select multiple。',
        extraScroll: '不要在 Cron 弹窗内部自建新的纵向滚动容器。'
      }
    },
    docsRule: {
      kicker: '文档规则',
      title: '文档维护规则',
      description: '新增或调整 HYN 组件时，组件文档必须和代码一起更新；文档不是展示页，是人和 AI 的共同开发协议。',
      requiredTag: 'Required',
      forbiddenTag: 'Forbidden',
      requiredItems: {
        boundary: '写清组件边界：什么时候用，什么时候不用。',
        api: '写清字段配置或 props/emits/slots/expose。',
        internals: '列出内部关键组件或关键函数的职责。',
        copyableCode: '提供 AI 可复制的最小真实代码。',
        acceptance: '写明视觉协议、性能边界和验收方式。'
      },
      forbiddenItems: {
        demoOnly: '不能只放一个 demo，不解释字段。',
        sourceOnly: '不能只写“参考源码”，让下一个人重新读全量实现。',
        privateBoundary: '不能遗漏私有子组件的职责边界。',
        catalog: '不能新增组件后不维护 catalog.ts 和 HYN reference。',
        oldPatterns: '不能把过时页面写法保留成示例。'
      }
    }
  }
};
