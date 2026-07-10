export default {
  layout: {
    skipToContent: 'Skip to content',
    sidebarAria: 'HYN component docs navigation',
    brandTitle: 'Component Atlas',
    brandSubtitle: 'Sage Glass Developer Docs',
    overviewTitle: 'Overview',
    overviewCaption: 'Selection, rules, acceptance',
    tocAria: 'Current document table of contents',
    tocTitle: 'On this page',
    fallbackSection: 'Section {index}'
  },
  catalog: {
    title: {
      i18nBoundary: 'Multilingual Boundary',
      globalConfig: 'Global Configuration',
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
      guide: 'Guide',
      dataDisplay: 'Data Display',
      dataEntry: 'Data Entry',
      feedback: 'Feedback'
    },
    caption: {
      i18nBoundary: 'Text ownership, backend contracts, and audit judgment for AI coding',
      globalConfig: 'Shared HYN defaults, local overrides, and maintenance rules',
      table: 'Default table for paged CRUD pages, with unified columns, tooltips, and action cells',
      form: 'Project form protocol with unified labels, field grids, control widths, and inner alignment',
      treeSelect:
        'Generic tree select field with hierarchy mode, virtual flat mode, local search, and independent selection',
      deptSelect:
        'Department selector for HynForm and HynDialog fields, with single-select, multi-select, and virtual flat modes',
      dialog: 'Default entry for create, edit, and detail dialogs, backed by el-dialog',
      cronExpression: 'Quartz Cron expression field with lightweight inline input and lazy-loaded builder/parser logic',
      tableDialog:
        'Dialog pattern combining filters, bulk actions, table data, and pagination for logs, audits, and authorization',
      virtualTable: 'Large flat data tables for authorization dialogs, logs, and audit views',
      virtualTreeTable:
        'Default large-tree solution for departments, organizations, regions, categories, and permissions',
      entityPicker: 'Remote inline entity selection and cross-page table selection in dialogs'
    },
    status: {
      stable: 'Stable',
      preview: 'Preview',
      planned: 'Planned'
    }
  },
  globalConfig: {
    hero: {
      kicker: 'HYN Global Configuration',
      title: 'Global Configuration',
      description:
        'Shared HYN behavior defaults are maintained through one entry. The overview stays limited to selection and navigation; full protocols belong on this dedicated menu page.',
      pills: {
        singleEntry: 'Single config entry',
        localOverride: 'Explicit local overrides',
        docsRequired: 'New configs require docs'
      }
    },
    reference: {
      kicker: 'Config Table',
      title: 'Supported Settings',
      description:
        'The HYN-owned config entry is `src/components/Hyn/config.ts`. The root component injects it with `provideHynGlobalConfig(hynGlobalConfig)`; it does not belong in Pinia or Element Plus ConfigProvider.',
      aria: 'HYN global configuration reference',
      columns: {
        name: 'Config',
        defaultValue: 'Default',
        description: 'Description'
      },
      rows: {
        typeSource:
          'The three-state protocol type is defined in src/components/Hyn/shared/overflow.ts. It only limits valid values and does not provide a runtime default. Global config, table columns, form labels, and dialog labels all reuse it.',
        overflowMode:
          'The runtime default comes from hynGlobalConfig.overflowMode in src/components/Hyn/config.ts, currently fit. It controls the default text overflow strategy for HynTable, HynVirtualTable, HynVirtualTreeTable, HynForm labels, and HynDialog labels.',
        overflowModeOverride:
          'Table, virtual table, virtual tree table, and column text overflow strategy. When omitted, it inherits hynGlobalConfig.overflowMode.',
        localDefault: 'inherits global',
        labelOverflowMode:
          'Local label overflow prop for HynForm and HynDialog. When omitted, it inherits hynGlobalConfig.overflowMode for that form or dialog.',
        autoWidth:
          'Enabled by default for HynDialog config forms. width is the desired minimum; final width is calculated from current-language labels, control text, column gap, and body padding.',
        supportedName: 'supported components',
        supportedDefault: 'HYN public components',
        supportedComponents:
          'Scope: HynTable, HynVirtualTable, HynVirtualTreeTable, HynForm, and HynDialog. HynDialog additionally supports autoWidth.',
        priorityName: 'priority and docs rule',
        required: 'required',
        priorityRule:
          'Priority is fixed: local prop, column setting, or explicit label config > HYN global config > fit. Every new shared HYN behavior config must be added to this menu, HYN_COMPONENT_SYSTEM.md, and the HYN AI reference.'
      },
      codeTitle: 'Config Entry',
      code: `// src/components/Hyn/shared/overflow.ts
// This type only limits valid values. It does not provide a runtime default.
export type HynTextOverflowMode = 'fit' | 'ellipsis' | 'wrap';

// src/components/Hyn/config.ts
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import type { HynTextOverflowMode } from './shared/overflow';

/** HYN global component config for shared display defaults across public HYN components. */
export interface HynGlobalConfig {
  /** Default behavior when text exceeds component space; local props or column settings win. */
  overflowMode: HynTextOverflowMode;
}

// The runtime default comes from this object, so the system default is fit.
export const hynGlobalConfig: HynGlobalConfig = {
  overflowMode: 'fit'
};

// App.vue
provideHynGlobalConfig(hynGlobalConfig);`
    },
    modes: {
      kicker: 'Overflow Strategy',
      title: 'The Three-State overflowMode Protocol',
      description:
        'This config expresses layout intent, not just a CSS clipping switch. The default fit mode serves complete multilingual display; ellipsis and wrap require an explicit caller choice.',
      codeTitle: 'Three-State Protocol Type Source',
      code: `// 1. Change the single type source for the three-state protocol; this does not create a default.
// src/components/Hyn/shared/overflow.ts
export type HynTextOverflowMode = 'fit' | 'ellipsis' | 'wrap';

// 2. Change the system runtime default only here.
// src/components/Hyn/config.ts
export const hynGlobalConfig: HynGlobalConfig = {
  overflowMode: 'fit'
};

// 3. Standalone cases without a provider also fall back to this default config.
export function useHynGlobalConfig(): HynGlobalConfig {
  return inject(hynGlobalConfigKey, hynGlobalConfig);
}

// 4. Use local overrides only when a page or column really needs another strategy.
<hyn-table overflow-mode="ellipsis" />
<hyn-form label-overflow-mode="wrap" />

const columns: HynTableColumn<UserRow>[] = [
  { prop: 'name', label: t('app.user.name'), overflowMode: 'fit' }
];`,
      cards: {
        fit: {
          title: 'Prefer Complete Display',
          description:
            'Prefer complete single-line display and carry long text with column width, dialog width, or horizontal scrolling. Let layout switch only when the viewport truly cannot hold it.'
        },
        ellipsis: {
          title: 'Ellipsis Only on Real Overflow',
          description:
            'Use only when the caller explicitly asks for truncation. It must provide a tooltip based on real overflow detection, never silent clipping.'
        },
        wrap: {
          title: 'Explicit Wrapping',
          description:
            'Use when the caller knows wrapping is acceptable. Fixed-row-height virtual tables must not inherit wrap by accident and break row measurement.'
        }
      }
    },
    priority: {
      kicker: 'Override Order',
      title: 'Local Overrides Win Over Global Defaults',
      description:
        'Global config provides defaults only. It must not erase explicit page or column intent; when the caller writes a prop or column config, HYN respects it.',
      cardTitle: 'Resolution Order',
      checks: {
        explicit:
          'Component props, column-level overflowMode, labelOverflowMode, and other explicit settings come first.',
        global: 'When no local setting exists, read hynGlobalConfig.overflowMode.',
        default: 'When nothing is injected or configured, fall back to fit.',
        virtualTable:
          'Virtual tables still use fit to carry horizontal space by default; only explicit ellipsis or wrap changes the cell display protocol.'
      },
      codeTitle: 'Local Override Examples'
    },
    maintenance: {
      kicker: 'Maintenance',
      title: 'Documentation Rules for New Public Configs',
      description:
        'Global config is a public HYN contract, not a hidden implementation detail. New configs must update user-facing docs and the AI reference together.',
      cardTitle: 'Acceptance Checklist',
      checks: {
        configFile: 'The config entry stays in src/components/Hyn/config.ts.',
        publicTypes:
          'Public types are exported from the HYN public types entry, so pages do not import internal files.',
        docsPage: 'This menu explains defaults, scope, local override behavior, and validation points.',
        overview:
          'Global config content stays on this menu. The overview carries entry-level information only, not the full config protocol.',
        references:
          'Update HYN_COMPONENT_SYSTEM.md and .codex/skills/frontend-crud-coding/references/hyn-components.md together.'
      }
    }
  },
  i18nBoundary: {
    hero: {
      kicker: 'AI i18n Guide',
      title: 'Multilingual Boundary',
      description:
        'This page is not a fixed page template. It is the guardrail AI must use whenever a task touches copy, backend display values, or HYN docs examples.',
      pills: {
        fixedUi: 'Frontend keys own fixed UI',
        backendContract: 'Business values follow backend contracts',
        audit: 'i18n audit guards regressions'
      }
    },
    ownership: {
      kicker: 'First Principle',
      title: 'Classify Text Ownership First',
      description:
        'Do not start by translating. First decide who owns the text. Correct ownership keeps business data from being translated in the frontend by guesswork.',
      cards: {
        fixedUi: {
          kind: 'Frontend',
          title: 'Fixed UI Copy',
          description:
            'Buttons, titles, placeholders, dialogs, messages, rules, empty states, aria text, and upload/download prompts use stable i18n keys with synchronized zh_CN/en_US.'
        },
        businessData: {
          kind: 'Backend',
          title: 'Business Data',
          description:
            'Departments, roles, posts, apps, dictionaries, menus, error messages, and user input show original values by default. Translate only when backend provides keys or localized fields.'
        },
        docsDemo: {
          kind: 'Docs / Demo',
          title: 'Docs and Local Examples',
          description:
            'HYN docs pages, Component Atlas, and local demos are frontend-visible content and use `hynDocs.*`, but demo business values must not become real business translation maps.'
        }
      }
    },
    matrix: {
      kicker: 'Decision Matrix',
      title: 'What To Do By Scenario',
      description: 'Features and page shapes vary, but text ownership boundaries stay stable.',
      aria: 'Multilingual boundary decision matrix',
      columns: {
        scene: 'Scene',
        frontend: 'Frontend Action',
        backend: 'Backend Contract'
      },
      rows: {
        button: {
          scene: 'Buttons / dialogs / rules / empty states',
          frontend: 'Add stable keys, fill zh_CN and en_US, and use t() or $t().',
          backend: 'No backend work needed.',
          codeTitle: 'Fixed UI: key plus business-value interpolation'
        },
        department: {
          scene: 'Department trees / org trees / posts / roles / apps',
          frontend:
            'Without a contract, show original fields such as deptName, roleName, postName, and appName. Do not guess English.',
          backend: 'To show English, provide nameKey or labels.zh_CN/en_US.',
          codeTitle: 'Business tree: translated column title, raw node names'
        },
        dictionary: {
          scene: 'Dictionary items / business enums',
          frontend: 'Without a contract, show dictLabel. With labelKey or localized labels, translate by contract.',
          backend: 'Provide stable code plus labelKey, or labels.zh_CN/en_US.',
          codeTitle: 'Dictionary items: consume backend labels, no guessing map'
        },
        backendError: {
          scene: 'Backend business errors',
          frontend:
            'Without messageKey/code, use the existing error display strategy. Do not infer English from Chinese error messages.',
          backend: 'Provide stable error code or messageKey.',
          codeTitle: 'Backend errors: translate only with a key'
        },
        hynDocs: {
          scene: 'HYN docs / local demos',
          frontend: 'Use `hynDocs.*` for every visible string and keep zh/en structures aligned.',
          backend: 'No backend work needed. Real business pages still follow API contracts.',
          codeTitle: 'HYN docs: local examples use hynDocs keys'
        }
      }
    },
    codeExamples: {
      kicker: 'Synced Examples',
      title: 'Scenarios And Code Stay Together',
      description:
        'The code blocks below are rendered from the same matrix data. When a scenario changes, update its matching code example so AI has an executable pattern.'
    },
    aiChecklist: {
      kicker: 'AI Execution',
      title: 'Minimum Check For Every Task',
      description:
        'This is not a waterfall process. It is a pause point whenever a change touches visible copy or business display values.',
      cardTitle: 'Before Handoff',
      items: {
        classifyText:
          'Did you classify new or changed text as fixed UI, HYN demo, backend business value, or developer diagnostic?',
        addKeys:
          'Did fixed UI and HYN demos receive synchronized `src/lang/modules/zh_CN` and `src/lang/modules/en_US` keys?',
        noGuessing: 'Did you avoid frontend maps that guess English from Chinese business values?',
        audit: 'If UI copy, locale files, public components, or templates changed, did `pnpm i18n:audit` pass?',
        handoff: 'Did the handoff name any backend key or localized-field contract that is still missing?'
      },
      codeTitle: 'Handoff Template',
      code: `i18n handling:
- Fixed UI copy: zh_CN/en_US keys are complete.
- Business data: backend values such as departments, dictionaries, and menus are displayed from original fields; no frontend guessing map was added.
- Backend blocker: English business values require backend nameKey, labelKey, messageKey, or labels.zh_CN/en_US.
Validation: pnpm i18n:audit passed.`
    }
  },
  home: {
    hero: {
      kicker: 'HYN Component System',
      title: 'A component map for people and AI',
      description:
        'These docs are available only in local development. They put component selection, configuration examples, visual contracts, and AI constraints behind one verifiable entry point. Production builds do not carry the docs pages or depend on their routes.',
      pills: {
        localOnly: 'Local only',
        aiCopyable: 'AI copyable',
        typedExamples: 'Typed examples',
        visualContract: 'Visual contract'
      }
    },
    metrics: {
      routeMode: {
        label: 'Route Mode',
        value: 'Dev only',
        note: 'Served through local .local.ts routes and omitted from remote production.'
      },
      docShape: {
        label: 'Doc Shape',
        value: 'Recipes',
        note: 'Every page includes copyable templates, field recipes, and acceptance checks.'
      },
      designGoal: {
        label: 'Design Goal',
        value: 'Useful',
        note: 'Built for real coding work, not as a decorative showcase shell.'
      }
    },
    componentDocs: {
      kicker: 'Component Docs',
      title: 'Component Entries',
      description:
        'Each component page includes conclusions, usage boundaries, live demos, copyable code, API notes, recipes, AI rules, and acceptance checks.'
    },
    decisionMatrix: {
      kicker: 'Decision Matrix',
      title: 'Component Selection Matrix',
      description:
        'When creating a page, choose components by business scenario first, not by whichever control feels most familiar.',
      aria: 'HYN component selection matrix',
      columns: {
        scene: 'Scenario',
        component: 'Default Component',
        reason: 'Reason and Boundary'
      },
      rows: {
        pagedCrud: {
          scene: 'Paged CRUD',
          component: 'HynTable + HynDialog',
          reason:
            'Default entry. Table columns and dialog fields are described in TypeScript, while HYN owns styling and tooltip behavior.'
        },
        flatLargeData: {
          scene: 'Large flat lists',
          component: 'HynVirtualTable',
          reason:
            'Best for authorization dialogs, logs, audits, and entity candidates with hundreds of rows or more; do not force complex native-table behavior into it.'
        },
        treeTable: {
          scene: 'Organization, department, and permission trees',
          component: 'HynVirtualTreeTable',
          reason:
            'The hook owns tree indexes, expansion, and lazy-loading state, so pages do not reimplement tree algorithms.'
        },
        inlineEntity: {
          scene: 'Inline entity selection in forms',
          component: 'HynRemoteSelect / remoteSelect field',
          reason:
            'Users, roles, posts, and similar entities must support remote search and stable echo; do not load everything into el-select.'
        },
        dialogEntity: {
          scene: 'Cross-page entity selection in dialogs',
          component: 'HynEntityPicker',
          reason:
            'Fits authorized users, cross-page multi-select, and search-confirm flows; internally it reuses the virtual table.'
        }
      }
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Default Generation Rules',
      description:
        'Put this block into new CRUD tasks so AI uses the company component template directly instead of falling back to raw Element Plus tables and dialogs.',
      codeTitle: 'AI Prompt Snippet',
      code: `When creating a standard paged CRUD page:
- Use HynTable for the main table. Do not manually stack el-table-column.
- Use HynDialog + fields for create/edit dialogs. Do not hand-code el-row/el-col/el-form-item form grids.
- Use HynVirtualTable for large flat lists.
- Use HynVirtualTreeTable + useHynVirtualTreeTable for tree tables.
- Use HynRemoteSelect or HynEntityPicker for users, roles, posts, and other entity selectors.
- Do not override .hyn-table, .hyn-dialog, .data-table, :deep(.el-table*), or :deep(.el-form-item) styles in pages.
- After implementation, run vue-tsc, lint, build:dev, and verify table tooltips, dialog borders, scrolling, and footer behavior in the browser.`
    },
    i18nBoundary: {
      kicker: 'Multilingual Boundary',
      title: 'Multilingual Boundary',
      description:
        'HYN docs serve people and AI, but they still follow the system-wide i18n boundary: frontend keys own fixed UI text, while real business data depends on backend contracts.',
      cards: {
        docs: {
          kind: 'Docs / Demo',
          title: 'Docs and Local Examples',
          description:
            'Component Atlas, component docs, and local demos use `hynDocs.*` visible text with synchronized zh_CN and en_US messages.'
        },
        business: {
          kind: 'Business Data',
          title: 'Do Not Guess Values',
          description:
            'Departments, roles, posts, apps, dictionaries, and menu names only use confirmed backend keys or localized fields. Without that contract, show the original value.'
        },
        audit: {
          kind: 'AI Guardrail',
          title: 'Execution Guardrail',
          description:
            '`docs/i18n-ai-coding-guide.md` carries the full judgment path. It is a text-ownership and review guide, not a fixed page implementation flow.'
        }
      }
    },
    design: {
      kicker: 'Docs Design',
      title: 'Documentation Principles',
      description: 'The docs borrow from mature component libraries, but only where the idea helps this project.',
      principles: {
        apiLayers: {
          kind: 'Element Plus',
          title: 'Keep API Layers',
          description:
            'Preserve the basic shape of props, events, and slots, then add business boundaries and AI examples.'
        },
        scenarioFirst: {
          kind: 'Ant Design',
          title: 'Scenario First',
          description: 'Organize examples by real business tasks instead of stacking demos by control property.'
        },
        dataModel: {
          kind: 'MUI X',
          title: 'Clear Data Model',
          description: 'Make rows, columns, adapters, and field config structures explicit.'
        },
        doDont: {
          kind: 'Polaris',
          title: 'Do / Don’t',
          description: 'State recommendations and prohibitions clearly so AI generation avoids old patterns.'
        }
      }
    },
    localOnly: {
      kicker: 'Local Only',
      title: 'Local Isolation',
      description:
        'Component docs are local development assets. Remote production should not include docs source, docs markdown, or docs routes.',
      boundaryTitle: 'Remote Boundary',
      checks: {
        viewPath: 'Docs pages live under `src/views/component/hyn/` and are included in gitignore.',
        routePath: 'Docs routes live under `src/router/modules/*.local.ts` and load only under the Vite dev server.',
        noStaticImport: 'Production code does not statically import HYN docs files.',
        localMarkdown: 'Markdown component docs also stay local and do not enter the remote repository.',
        i18nBoundary:
          'Visible docs and local demo text use `hynDocs.*`; real business data still follows backend key or localized-field contracts.'
      },
      grepTitle: 'Grep Acceptance'
    }
  },
  dialog: {
    hero: {
      kicker: 'Feedback / Form Schema',
      title: 'HynDialog',
      description:
        'Normal create/edit dialogs should declare TypeScript field config by default. HynDialog owns the shell, footer, inner scrolling, form grid, label tooltip, control width, validation, and error scrolling so pages no longer hand-code form layout styles.',
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
        note: 'Passing model and fields enables config-form mode.'
      },
      submitFlow: {
        label: 'Submit flow',
        value: 'Validate first',
        note: 'The confirm button calls internal validate first and emits submit only after success.'
      },
      escapeHatch: {
        label: 'Escape hatch',
        value: 'Slot',
        note: 'Details, imports, permission trees, and other non-standard content still use slots.'
      }
    },
    live: {
      kicker: 'Live Sample',
      title: 'Normal Create/Edit Dialog',
      description:
        'Open the sample and check the number input border, two-column layout, full-width textarea, footer loading, and label tooltip.',
      openButton: 'Open Config Form Dialog',
      dialogTitle: 'Maintain Post',
      postCodeTooltip: 'The code is usually not changed freely after saving.',
      submitSuccess: 'Form validation passed',
      status: {
        enabled: 'Enabled',
        disabled: 'Disabled'
      }
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Standard CRUD Dialog Template',
      description:
        'Copy this structure for normal create/edit pages. Use 640px / 92px for standard two-column forms; explicitly narrow only small single-column forms.',
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
      kicker: 'Field Recipes',
      title: 'Field Type Examples',
      description:
        'Every field type has an explicit type. Do not hide everything behind a giant componentProps:any escape hatch.',
      codeTitle: '{type} field',
      items: {
        input: {
          type: 'input',
          title: 'Single-line Text',
          span: 'span: 1',
          description:
            'Use it for names, codes, email addresses, phone numbers, and other short text. Password fields use showPassword.',
          code: `{'{'} key: 'postName', label: t('app.systemPost.field.postName'), prop: 'postName', type: 'input', placeholder: t('app.systemPost.placeholder.postName'), maxlength: 30 {'}'}`
        },
        textarea: {
          type: 'textarea',
          title: 'Multi-line Text',
          span: 'full',
          description: 'Use it for remarks, descriptions, and notice summaries. It should usually span the full row.',
          code: `{'{'} key: 'remark', label: t('app.common.remark'), prop: 'remark', type: 'textarea', rows: 4, maxlength: 200, showWordLimit: true {'}'}`
        },
        number: {
          type: 'number',
          title: 'Number Input',
          span: 'span: 1',
          description:
            'Use it for sort order, thresholds, and counts. HYN keeps controls-position and the right border stable.',
          code: `{'{'} key: 'orderNum', label: t('app.systemPost.field.postSort'), prop: 'orderNum', type: 'number', min: 0, step: 1, precision: 0 {'}'}`
        },
        select: {
          type: 'select',
          title: 'Enum Select',
          span: 'span: 1',
          description: 'Use it for small internal enums. Users, roles, and other entities should use remoteSelect.',
          code: `{'{'} key: 'noticeType', label: t('app.systemNotice.field.noticeType'), prop: 'noticeType', type: 'select', clearable: true, options: noticeTypeOptions.value {'}'}`
        },
        radio: {
          type: 'radio',
          title: 'Small Exclusive Options',
          span: 'span: 1',
          description: 'Use it for status, external-link flags, and other two-to-four-option choices.',
          code: `{'{'} key: 'status', label: t('app.common.status'), prop: 'status', type: 'radio', options: statusOptions.value {'}'}`
        },
        checkbox: {
          type: 'checkbox',
          title: 'Small Multi-select Set',
          span: 'full',
          description:
            'Use it for small fixed permission or switch sets. Large entity multi-select uses remoteSelect or EntityPicker.',
          code: `{'{'} key: 'menuTypes', label: t('app.systemMenu.field.menuType'), prop: 'menuTypes', type: 'checkbox', options: menuTypeOptions.value {'}'}`
        },
        switch: {
          type: 'switch',
          title: 'Boolean or Status Switch',
          span: 'span: 1',
          description: 'Use it for enabled, cached, or external-link flags. Values may map to backend strings.',
          code: `{'{'} key: 'visible', label: t('app.systemMenu.field.visible'), prop: 'visible', type: 'switch', activeValue: '0', inactiveValue: '1' {'}'}`
        },
        date: {
          type: 'date',
          title: 'Single Date/Time',
          span: 'span: 1',
          description:
            'Use it for start and deadline fields. Keep valueFormat unified instead of ad hoc Date/string handling.',
          code: `{'{'} key: 'startTime', label: t('app.common.startDate'), prop: 'startTime', type: 'date', dateType: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' {'}'}`
        },
        dateRange: {
          type: 'dateRange',
          title: 'Date Range',
          span: 'full',
          description: 'Use it for validity and editable query ranges. Range controls default to full row.',
          code: `{'{'} key: 'validRange', label: t('app.common.startDate'), prop: 'validRange', type: 'dateRange', dateType: 'daterange', valueFormat: 'YYYY-MM-DD' {'}'}`
        },
        treeSelect: {
          type: 'treeSelect',
          title: 'Small Tree Select',
          span: 'full',
          description:
            'Use it for departments or parent menus with controlled scale. Large trees should use dedicated HYN tree capabilities.',
          code: `{'{'} key: 'parentId', label: t('app.systemMenu.field.parentId'), prop: 'parentId', type: 'treeSelect', data: menuOptions.value, props: treeSelectProps, linkage: false, clearable: true {'}'}`
        },
        remoteSelect: {
          type: 'remoteSelect',
          title: 'Remote Entity Select',
          span: 'full',
          description:
            'Use it for growing entities such as users, roles, and posts. Provide an adapter and fetchByKeys for stable echo.',
          code: `{'{'} key: 'roleIds', label: t('app.systemRole.field.roleName'), prop: 'roleIds', type: 'remoteSelect', adapter: roleEntityAdapter, searchParam: 'roleName', multiple: true {'}'}`
        },
        iconSelect: {
          type: 'iconSelect',
          title: 'Icon Select',
          span: 'span: 1',
          description: 'Use it for menu icon fields. The existing icon selector still owns the picker UI.',
          code: `{'{'} key: 'icon', label: t('app.systemMenu.field.icon'), prop: 'icon', type: 'iconSelect' {'}'}`
        },
        editor: {
          type: 'editor',
          title: 'Rich Text',
          span: 'full',
          description:
            'Use it for notice content. It defaults to full row so the editor is not squeezed in a two-column grid.',
          code: `{'{'} key: 'noticeContent', label: t('app.systemNotice.field.noticeContent'), prop: 'noticeContent', type: 'editor', minHeight: 240 {'}'}`
        },
        imageUpload: {
          type: 'imageUpload',
          title: 'Image Upload',
          span: 'full',
          description:
            'Use it for covers, avatars, and image assets. Do not force image preview dialogs into HynDialog fields.',
          code: `{'{'} key: 'coverUrl', label: t('app.common.import'), prop: 'coverUrl', type: 'imageUpload', limit: 1, fileSize: 5, fileType: ['png', 'jpg', 'jpeg'] {'}'}`
        },
        fileUpload: {
          type: 'fileUpload',
          title: 'File Upload',
          span: 'full',
          description:
            'Use it for attachments that write backend file paths, not for import-before-submit local files.',
          code: `{'{'} key: 'attachment', label: t('app.common.import'), prop: 'attachment', type: 'fileUpload', limit: 3, fileSize: 20, fileType: ['pdf', 'doc', 'docx', 'xlsx'] {'}'}`
        },
        filePicker: {
          type: 'filePicker',
          title: 'Local File Picker',
          span: 'full',
          description: 'Use it for simple imports. It writes File to the model and the page builds FormData on submit.',
          code: `{'{'} key: 'file', label: t('app.common.import'), prop: 'file', type: 'filePicker', drag: true, fileType: ['xls', 'xlsx'], buttonText: t('app.common.import') {'}'}`
        },
        display: {
          type: 'display',
          title: 'Read-only Display',
          span: 'span: 1',
          description: 'Use it in detail dialogs for creator, creation time, and system-generated IDs.',
          code: `{'{'} key: 'createTime', label: t('app.common.createTime'), type: 'display', formatter: model => String(model.createTime ?? '-') {'}'}`
        },
        slot: {
          type: 'slot',
          title: 'Controlled Escape Hatch',
          span: 'full',
          description:
            'Use it when HYN should own the form item, but business content must be handled by a child component.',
          code: `{'{'} key: 'permissionTree', label: t('app.systemMenu.field.perms'), type: 'slot', slot: 'permissionTree', span: 'full' {'}'}`
        }
      }
    },
    reference: {
      kicker: 'Reference',
      title: 'Component API',
      description:
        'HynDialog wraps only ordinary dialogs and ordinary forms. It does not own permission trees, imports, previews, or code viewers.',
      aria: 'HynDialog API',
      columns: {
        field: 'Field',
        type: 'Type',
        description: 'Description'
      },
      rows: {
        modelValue: 'Controls dialog visibility.',
        title: 'Dialog title. Create, edit, and detail dialogs should use clear business names.',
        widthTop:
          'Dialog width and top offset. Config forms auto-size by current language; pure slot dialogs default to 560px.',
        buttonText: 'Footer button copy. Defaults to Confirm / Cancel.',
        confirmLoading: 'Confirm button loading state. Business pages must control it during submit.',
        showFooter: 'Disable the default footer for detail dialogs or fully custom footers.',
        model: 'Config-form data object. When model and fields are passed, confirm validates the form first.',
        fields: 'Field config array. Each type has its own prop shape.',
        rules: 'Element Plus form validation rules. Keep using the official Form capability.',
        columns: 'Form column count. Defaults to two columns and collapses to one column on small screens.',
        labelWidth: 'Unified label width. Config dialogs default to 92px; do not write page-local label styles.',
        submit: 'Emitted after config-form validation succeeds. Prefer this event for normal create/edit.',
        confirm: 'Confirm event for slot dialogs. It does not run internal form validation.',
        expose: 'Use this instead of directly taking an el-form ref in pages.'
      }
    },
    boundary: {
      kicker: 'Do / Don’t',
      title: 'Boundary Rules',
      description:
        'Configuration does not mean putting every business flow into HynDialog. It standardizes frequent normal forms.',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        modelFields: "Use `model + fields + rules + {'@'}submit` for normal create/edit dialogs.",
        tooltip: 'Use field `tooltip` for label helper text instead of hand-written label slots.',
        filePicker: "Use `filePicker` for simple imports, then build `FormData` in `{'@'}submit`.",
        slotContent:
          'Keep details, complex imports, permission trees, and code previews in slots, without overriding the HYN shell.',
        childComponent:
          'Extract complex business regions into child components; slots carry content only and do not add global deep styles.'
      },
      dontItems: {
        rawGrid: 'Do not hand-code `el-row/el-col/el-form-item` grids in normal forms.',
        extraClasses: 'Do not add `.dialog-form`, `.dialog-grid-form`, or `.permission-dialog-form`.',
        deepOverrides: 'Do not write page-level `:deep(.el-form-item)` or `:deep(.el-input-number)` overrides.',
        permissionTree: 'Do not turn role permission trees or complex import flows into HynDialog field types.'
      }
    },
    acceptance: {
      kicker: 'Acceptance',
      title: 'Acceptance Checklist',
      description: 'After dialog migration, verify objective signals instead of relying on looks-good judgment.',
      manualTitle: 'Manual Acceptance',
      codeTitle: 'Style Guard',
      items: {
        numberBorder: 'The number input right border is intact and controls-position is right.',
        columns: 'Two-column fields stay stable, and small screens collapse to one column.',
        fullFields: 'textarea, editor, imageUpload, fileUpload, filePicker, and treeSelect default to full row.',
        bodyScroll:
          'When content is taller than the viewport, the body scrolls internally without expanding past the viewport.',
        loading: 'During submit loading, the confirm button shows loading and cancel remains stable.'
      },
      code: `rg "dialog-form|dialog-grid-form|permission-dialog-form" src/views
rg ":deep\\(\\.el-form-item|:deep\\(\\.el-input-number|:deep\\(\\.hyn-dialog" src/views
rg "<el-dialog" src/views`
    }
  },
  entityPicker: {
    hero: {
      kicker: 'Data Entry',
      title: 'HynRemoteSelect / HynEntityPicker',
      description:
        'Use these components for selecting users, roles, posts, applications, and other entities. The first version proves the limits of normal el-select / el-table at large scale, then moves remote search, virtual lists, paged tables, and selected echo into shared components.',
      pills: {
        remoteSearch: 'Remote search',
        virtualDropdown: 'Virtual dropdown',
        crossPage: 'Cross-page selection',
        benchmark: 'Verifiable benchmark'
      }
    },
    metrics: {
      target: {
        label: 'Target',
        value: 'Entity selection',
        note: 'Growing objects such as users, roles, posts, and applications.'
      },
      validation: {
        label: 'Validation',
        value: 'Benchmark',
        note: 'Use DOM count and open cost to prove the benefit.'
      },
      boundary: {
        label: 'Replacement boundary',
        value: 'High cost',
        note: 'Small enums should still use Element Plus.'
      }
    },
    fields: {
      name: 'Name',
      code: 'Code',
      status: 'Status'
    },
    placeholders: {
      name: 'Enter name',
      code: 'Enter code'
    },
    status: {
      enabled: 'Enabled',
      disabled: 'Disabled'
    },
    apiColumns: {
      field: 'Field',
      type: 'Type',
      description: 'Description'
    },
    benchmark: {
      kicker: 'Benchmark',
      title: 'Legacy Dropdown vs Virtual Dropdown',
      description:
        'Switch the data size, open both selectors, then click Refresh Metrics to inspect popup DOM count and preparation cost.',
      legacyTitle: 'Normal el-select',
      legacyDescription:
        'Simulates rendering all options. As data grows, option DOM and filter cost grow close to linearly.',
      remoteTitle: 'HynRemoteSelect',
      remoteDescription:
        'Simulates a remote first page and virtual options. Candidates are not rendered all at once with total size.',
      legacyPlaceholder: 'Legacy: all options',
      legacySkippedPlaceholder: 'Legacy: {limit}+ items would freeze, rendering stopped',
      remotePlaceholder: 'New: remote virtual selection',
      refreshButton: 'Refresh Metrics',
      demoName: 'Demo Entity {index}',
      metrics: {
        skippedValue: 'Skipped',
        total: {
          label: 'Total rows',
          note: 'Current simulated entity total.'
        },
        legacyDom: {
          label: 'Legacy option DOM',
          note: 'Option node count after opening normal el-select.',
          skippedNote:
            'Above {limit} items, the legacy approach can freeze the docs page, so full option rendering is intentionally stopped.'
        },
        virtualDom: {
          label: 'Virtual option DOM',
          note: 'Option node count after opening the virtual dropdown.'
        },
        legacyCost: {
          label: 'Legacy open cost',
          note: 'Approximate cost from visible-change to the next frame.',
          skippedNote: 'The 5000 mode jank comes from the legacy full dropdown; HYN still loads by page on the right.'
        }
      }
    },
    pickerSample: {
      kicker: 'Picker Sample',
      title: 'Dialog Entity Selection',
      description:
        'The dialog selector reuses HynVirtualTable and fits authorized users, cross-page multi-select, and confirming after list search.',
      openButton: 'Open Entity Picker Dialog',
      dialogTitle: 'Select Demo Entity',
      selectedRows: 'Last confirmed selection: {count} entities.'
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Standard Entity Selection Template',
      description:
        'Use HynRemoteSelect for entity selection inside forms; use HynEntityPicker for cross-page selection and authorized-user workflows.',
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
      title: 'HynRemoteSelect Field Reference',
      description:
        'Used for remote entity selection inside forms. The key points are paged search, virtual dropdowns, and stable selected-key echo.',
      aria: 'HynRemoteSelect field reference',
      rows: {
        modelValue:
          'The selected entity key. Multi-select uses a key array, single-select uses one key, and both string and number primary keys are supported.',
        adapter: 'Required. Wraps paged query, key-based echo, key/label/disabled readers, and the initial query.',
        searchParam: 'Query field that receives the remote search keyword, such as roleName, postName, or userName.',
        pageSize:
          'Candidate count loaded per remote request. Default is 20; lightweight business fields may increase it explicitly.',
        multiple:
          'Whether multi-select is enabled. Default is false; user, role, and post form fields usually set it to true.',
        placeholder:
          'Placeholder copy before selection. HynDialog remoteSelect fields default to "Select" plus the field label.',
        disabled: 'Disables the selector, often used when editing self and role/post relations must not change.',
        clearable: 'Whether clearing is allowed. Default is true; clearing also emits v-model and clear.',
        collapseTags:
          'Whether multi-select tags collapse. Default is true to prevent many entity tags from growing the form row.',
        maxCollapseTags: 'Number of tags shown before collapse. Default is 1; common forms can set it to 2.',
        dropdownHeight:
          'Virtual dropdown panel height. Default is 274 and works with optionHeight to determine visible candidates.',
        optionHeight:
          'Single virtual option height. Default is 34 and must stay aligned with the actual option row height.',
        teleported:
          'Whether the popup is attached to body. Default is false so dropdowns do not detach from inputs inside docs or dialogs.',
        change: 'Selection change event returning the external key value and currently resolved entity rows.',
        clear: 'Clear event. Use it when business code must also clear related fields.'
      }
    },
    entityPickerApi: {
      kicker: 'Entity Picker API',
      title: 'HynEntityPicker Field Reference',
      description:
        'Used for dialog-based entity selection, especially cross-page multi-select, authorized users, and scenarios that need table columns.',
      aria: 'HynEntityPicker field reference',
      rows: {
        modelValue: 'The selected entity key. Multi-select returns a key array, single-select returns one key.',
        visible: 'Dialog visibility, controlled by the caller.',
        title: 'Dialog title, also used for the table panel title and confirmation semantics.',
        adapter:
          'Required. Dialog paging, cross-page selected echo, and disabled checks all depend on the same adapter.',
        columns: 'Table column config, reusing HynVirtualTableColumn with widths, alignment, and slots.',
        searchFields:
          'Top search fields in the dialog. Each field writes a text condition to query and does not carry tree filters.',
        multiple:
          'Whether multi-select is enabled. Default is true; single-select pickers can set it to false explicitly.',
        pageSize: 'Rows per page in the dialog table. Default is 10 and overrides initial query pageSize when opened.',
        emptyText: 'Empty-state text. Default is No data.',
        dialogWidth:
          'Dialog width. Default is min(800px, calc(100vw - 32px)); complex columns can widen it explicitly.',
        dialogTop:
          'Dialog top offset. Default is 15vh; short screens compress the table minimum height through internal styles.',
        showSelectedTags:
          'Whether selected tags appear in the table header. Default is false to avoid tag blocks competing with table selection.',
        confirm: 'Confirm event after clicking OK, returning selected rows and the current key value.',
        change: 'Selection-state change event, useful for syncing external counters or button state.',
        cancel: 'Cancel event. The component also closes visible.'
      }
    },
    adapterContract: {
      kicker: 'Adapter Contract',
      title: 'Complete Adapter Contract',
      description:
        '`fetchByKeys` is not an optional optimization. It decides whether selected values stay stable when search conditions change, pages switch, and edit forms echo values.',
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
      title: 'Picker Dialog Visual Contract',
      description:
        'Entity selectors should only consolidate data and interaction complexity. Their appearance must inherit system form, panel, and table tokens.',
      aria: 'Picker dialog visual contract',
      columns: {
        object: 'Object',
        rule: 'Rule',
        description: 'Description'
      },
      rows: {
        selectorDialog: {
          type: 'Required reuse',
          description:
            'Selection dialogs inherit panel, form hover/focus, and table hover tokens from the shared mixin.'
        },
        dialogWidth: {
          type: 'Medium width',
          description:
            'The default stays close to authorization-dialog size. Only tree selection or complex two-column layouts should widen it explicitly.'
        },
        showSelectedTags: {
          type: 'Off by default',
          description:
            'Table selection uses checkboxes and counter text by default, avoiding an extra tag block after selection.'
        }
      }
    },
    reference: {
      kicker: 'Reference',
      title: 'Usage Boundary',
      description:
        'This component only serves entity-data selection. It does not replace small enum dropdowns such as status, gender, or notice type.',
      aria: 'Entity selection component API',
      columns: {
        object: 'Object',
        type: 'Type',
        description: 'Description'
      },
      rows: {
        adapter: 'Wraps paged query, key-based echo, and key/label/disabled readers in one contract.',
        remoteSelect: 'Remote entity selection inside forms; prefer it when replacing large entity el-select fields.',
        entityPicker: 'Dialog table entity selection for authorized users and cross-page multi-select.',
        searchFields: 'Dialog search fields, excluding tree filters.'
      }
    },
    rules: {
      kicker: 'Do / Don’t',
      title: 'Entity Selection Rules',
      description: 'The core problem is remote search, paging, and stable echo, not renaming a dropdown.',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        adapter: 'Use an adapter for growing entities such as users, roles, posts, and applications.',
        fetchByKeys: 'Edit-form echo must resolve labels through `fetchByKeys`.',
        crossPage: 'Use HynEntityPicker for cross-page multi-select instead of depending on full dropdown data.',
        remoteField: 'Inside forms, render entity selection through the HynDialog `remoteSelect` field.'
      },
      dontItems: {
        fullSelect: 'Do not generate full `el-select multiple` controls for entities such as users, roles, and posts.',
        omitFetchByKeys: 'Do not omit `fetchByKeys`; otherwise edit pages lose selected labels.',
        smallEnum: 'Do not force small enum dictionaries into entity pickers.',
        styleOverride: 'Do not rewrite picker-dialog table styles in business pages.',
        guessBusinessLabels:
          'Do not guess English from backend business entity names; translate only when the backend provides keys or localized fields.'
      }
    }
  },
  table: {
    hero: {
      kicker: 'Data Display',
      title: 'HynTable',
      description:
        'The company-level table entry for ordinary paged CRUD pages, backed by Element Plus Table. Business pages keep rows, columns, slots, and pagination, while text overflow, date widths, action permissions, and visual protocol stay inside the component.',
      pills: {
        crud: 'Paged CRUD',
        overflow: 'Fit first',
        actions: 'Unified actions',
        kernel: 'Element Plus core'
      }
    },
    metrics: {
      defaultEntry: {
        label: 'Default Entry',
        value: 'CRUD',
        note: 'Use it for ordinary paged lists instead of hand-writing many el-table-column nodes.'
      },
      overflow: {
        label: 'Overflow',
        value: 'Fit',
        note: 'Content is shown on one line with horizontal scrolling by default; only explicit ellipsis truncates.'
      },
      actions: {
        label: 'Actions',
        value: 'Unified',
        note: 'Button size, tooltip, permission checks, and disabled state are consistent.'
      }
    },
    live: {
      kicker: 'Live Sample',
      title: 'Normal Table Sample',
      description:
        'Text columns fit on one line by default. Status uses a slot, and actions reuse unified button size, hover, permissions, and disabled state.',
      emptyText: 'No component data',
      selectedRows: '{count} selected rows.',
      fields: {
        id: 'ID',
        name: 'Name',
        code: 'Code',
        status: 'Status',
        createTime: 'Created At',
        remark: 'Remark',
        action: 'Action'
      },
      status: {
        enabled: 'Enabled',
        disabled: 'Disabled'
      },
      actions: {
        edit: 'Edit',
        delete: 'Delete'
      },
      rows: {
        standard: {
          name: 'Standard Post Maintenance',
          remark: 'This longer remark is used to verify the text overflow strategy.'
        },
        notice: {
          name: 'Notice Configuration',
          remark: 'Short remark'
        },
        archive: {
          name: 'Historical Data Archive',
          remark: 'Date columns must keep a clear display strategy even when constrained by a stable width.'
        }
      }
    },
    howTo: {
      kicker: 'How-to',
      title: 'Basic Usage',
      description:
        'Normal business pages declare `HynTableColumn<VO>[]`, use slots for complex cells, and place standard edit/delete buttons in `actions`.',
      boundaryTitle: 'Usage Boundary',
      boundaryDescription:
        'Use HynTable by default for paged CRUD, generated pages, and small maintenance pages. Use HynVirtualTable for logs, authorization dialogs, or flat lists with hundreds of rows; keep tree tables on HynVirtualTreeTable.',
      codeTitle: 'Vue Template',
      code: `<hyn-table
  v-model:selected-row-keys="selectedRowKeys"
  :rows="postList"
  :columns="postTableColumns"
  :row-key="getPostRowKey"
  :loading="loading"
  selection
  empty-text="No post data"
  {'@'}selection-change="handlePostSelectionChange"
>
  <template #status="{'{'} row {'}'}">
    <dict-tag :options="sys_normal_disable" :value="row.status" />
  </template>
</hyn-table>`
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Standard CRUD Table Template',
      description:
        'Copy this pattern for ordinary paged pages. Pagination, search, and export still remain owned by the page.',
      codeTitle: 'HynTable standard CRUD',
      code: `<hyn-table
  v-model:selected-row-keys="selectedRowKeys"
  :rows="postList"
  :columns="postTableColumns"
  :row-key="getPostRowKey"
  :loading="loading"
  selection
  empty-text="No post data"
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
      kicker: 'Column Recipes',
      title: 'Column Recipes',
      description:
        'Column config should express semantics. Do not fall back to stacking el-table-column and deep styles in pages.',
      items: {
        text: {
          kind: 'text',
          focus: 'fit',
          title: 'Plain Text Column',
          description: 'Shows complete one-line content by default. Declare only label, prop, and width.',
          code: `{'{'} key: 'postName', label: t('app.systemPost.field.postName'), prop: 'postName', minWidth: 150 {'}'}`
        },
        date: {
          kind: 'date',
          focus: 'stable width',
          title: 'Date Column',
          description: 'Date columns keep stable widths so ordinary lists do not jitter.',
          code: `{'{'} key: 'createTime', label: t('app.common.createTime'), prop: 'createTime', type: 'date' {'}'}`
        },
        slot: {
          kind: 'slot',
          focus: 'dict',
          title: 'Dict Status Column',
          description: 'Use a slot for complex display, while HYN still owns width and visual protocol.',
          code: `{'{'} key: 'status', label: t('app.common.status'), prop: 'status', width: 100, align: 'center', slot: 'status' {'}'}

<template #status="{'{'} row {'}'}">
  <dict-tag :options="sys_normal_disable" :value="row.status" />
</template>`
        },
        actions: {
          kind: 'actions',
          focus: 'permission',
          title: 'Unified Action Column',
          description: 'Button size, tooltip, permissions, and disabled state are handled by the HYN action cell.',
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
          title: 'Backend Sort Column',
          description:
            'Keep using custom sort for backend sorting, and do not lose reset-aware default sort state during migration.',
          code: `{'{'} key: 'createTime', label: t('app.common.createTime'), prop: 'createTime', type: 'date', sortable: 'custom', sortOrders: ['descending', 'ascending', null] {'}'}

<hyn-table :default-sort="defaultSort" {'@'}sort-change="handleSortChange" />`
        },
        selection: {
          kind: 'selection',
          focus: 'rowKey',
          title: 'Selection Column',
          description: 'Control selected state with row keys so it remains stable across refreshes.',
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
          title: 'Fixed Action Column',
          description:
            'Fixed-column background and hover/current colors are guaranteed by HYN styles; pages should not deep override them.',
          code: `{'{'} key: 'action', label: t('app.common.action'), align: 'center', fixed: 'right', actions: rowActions {'}'}`
        },
        height: {
          kind: 'height',
          focus: 'scroll',
          title: 'Dialog or Inline Table Height',
          description:
            'Do not pass height on ordinary pages. Use maxHeight when dialogs or inline edit tables need a stable scroll boundary.',
          code: `<hyn-table :rows="rows" :columns="columns" :row-key="getRowKey" max-height="420px" />`
        }
      }
    },
    reference: {
      kicker: 'Reference',
      title: 'Field Reference',
      description: 'The first API surface stays small and stable, covering real high-frequency CRUD usage first.',
      aria: 'HynTable API',
      columns: {
        field: 'Field',
        type: 'Type',
        description: 'Description'
      },
      rows: {
        rows: 'Rows on the current page. Paged pages still use pagination from the business page.',
        columns: 'Column config that expresses display logic through label, prop, type, slot, formatter, and actions.',
        rowKey: 'Stable row key used for selection state, current row, and Element Plus reserve-selection.',
        selectedRowKeys: 'Controlled selected row keys, usually through v-model:selected-row-keys.',
        selection: 'Enables the checkbox column. selection is the shorter template alias.',
        currentRowKey: 'Highlights the current business-context row.',
        height: 'Fixed height for internal scrolling. Normal pages usually omit it.',
        maxHeight: 'Maximum height without fixed empty space, useful for inline edit tables or dialog tables.',
        defaultSort: 'Default backend-sort state, usually paired with useTableSortQuery.',
        columnType: 'Date columns keep stable widths; action columns reuse the unified action cell.',
        sortable: 'Passes through Element Plus sorting. Backend sorting uses sortable: custom.',
        sortOrders: 'Custom sort order sequence used with sortable.',
        overflowMode:
          'Inherits `hynGlobalConfig.overflowMode` by default; column-level values override it. Only explicit ellipsis truncates and shows tooltip on real overflow.',
        actions: 'Action column config, either passed as props or declared in columns.'
      }
    },
    visual: {
      kicker: 'Visual Contract',
      title: 'Table Visual Contract',
      description:
        'User-visible table experience must stay consistent across HynTable, HynVirtualTable, and HynVirtualTreeTable.',
      items: {
        row: {
          kind: 'Row',
          title: 'Row Height and Hover',
          description:
            'Normal, virtual, and tree tables must share typography, row height, hover, and current-row colors.'
        },
        overflow: {
          kind: 'Overflow',
          title: 'Overflow Strategy',
          description:
            'Fit is the default; only explicit ellipsis truncates content and shows tooltip on real overflow.'
        },
        actions: {
          kind: 'Actions',
          title: 'Unified Buttons',
          description:
            'Action columns must reuse HynTableActionCell so size, spacing, permissions, and disabled state match.'
        },
        fixed: {
          kind: 'Fixed',
          title: 'Fixed Column Background',
          description:
            'When scrolling horizontally, fixed action columns must keep a solid background, border, and shadow.'
        },
        empty: {
          kind: 'Empty',
          title: 'Empty and Loading',
          description:
            'Empty state, loading, and pagination position must match the existing data-table visual protocol.'
        },
        slot: {
          kind: 'Slot',
          title: 'Slots Keep the Protocol',
          description: 'Custom cells inherit cell padding, one-line display, and overflow strategy.'
        }
      }
    },
    rules: {
      kicker: 'Do / Don’t',
      title: 'AI Generation Rules',
      description:
        'When migrating normal tables, preserve permissions, export, pagination, sorting, slots, and selection state instead of only replacing tags.',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        overflow: 'Let text columns rely on HYN overflow strategy; do not hand-code tooltip column by column.',
        date: "Use `type: 'date'` or explicit stable width for date columns.",
        actions: 'Use `actions`, put permissions in `permissions`, and disabled state in `disabled`.',
        slot: 'If a slot column needs one-line truncation, explicitly declare ellipsis strategy.'
      },
      dontItems: {
        rawTable: 'Do not add raw `el-table` for normal CRUD main tables.',
        deepStyles: 'Do not deep override HYN table headers, row height, or fixed-column background in pages.',
        largeLogs: 'Do not force thousands of log rows into normal HynTable.',
        slotVisual: 'Do not break the `.data-table` cell visual protocol for slot display.'
      }
    }
  },
  tableDialog: {
    hero: {
      kicker: 'Feedback / Data Workflow',
      title: 'HynTableDialog',
      description:
        'A dialog for logs, audits, authorization, and pickers that need filters, bulk actions, a table, and pagination. It owns only the dialog shell and regional contract; table content is provided through named slots so business pages do not reuse main-page toolbar styling.',
      pills: {
        filters: 'filters slot',
        actions: 'action row',
        table: 'table viewport',
        pagination: 'pagination slot'
      }
    },
    metrics: {
      defaultWidth: {
        label: 'Default width',
        value: '1120px',
        note: 'Defaults to min(1120px, calc(100vw - 32px)) so large dialogs do not sprawl at 90% width.'
      },
      layout: {
        label: 'Layout',
        value: 'Vertical',
        note: 'Filters, actions, table, and pagination each own a region, while the table consumes remaining height.'
      },
      useCase: {
        label: 'Use case',
        value: 'Table modal',
        note: 'List dialogs for logs, audits, authorization, and pickers.'
      }
    },
    live: {
      kicker: 'Live Sample',
      title: 'Log Table Dialog',
      description: 'The sample shows the standard combination of filters, bulk actions, a paged table, and pagination.',
      openButton: 'Open Table Dialog',
      dialogTitle: 'Schedule Logs',
      jobName: 'Job Name',
      jobNamePlaceholder: 'Enter job name',
      status: 'Execution Status',
      statusPlaceholder: 'Select execution status',
      success: 'Success',
      failure: 'Failure',
      search: 'Search',
      reset: 'Reset',
      delete: 'Delete',
      export: 'Export',
      emptyText: 'No log data',
      columns: {
        id: 'Log ID',
        jobName: 'Job Name',
        invokeTarget: 'Invoke Target',
        status: 'Execution Status',
        createTime: 'Execution Time',
        action: 'Action',
        detail: 'Detail'
      },
      demoJob: {
        systemDefault: 'System Default',
        dataSync: 'Data Sync'
      }
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Standard Table Dialog Template',
      description:
        'Copy this structure for log, audit, and authorization dialogs. Use HynDialog + fields for normal create/edit forms.',
      codeTitle: 'HynTableDialog',
      code: `<hyn-table-dialog
  v-model="logDialog.visible"
  title="Schedule Logs"
  width="min(1240px, calc(100vw - 48px))"
  :loading="logLoading"
  :total="logTotal"
  :selected-count="selectedLogRowKeys.length"
>
  <template #filters>
    <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
      <!-- Query fields -->
    </el-form>
  </template>

  <template #actions>
    <el-button type="danger" plain icon="Delete" :disabled="selectedLogRowKeys.length === 0">Delete</el-button>
    <el-button type="warning" plain icon="Download">Export</el-button>
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
      kicker: 'Reference',
      title: 'Component API',
      description:
        'The component defines only the regional contract. It does not own business query, selection, or pagination data flow.',
      aria: 'HynTableDialog API',
      columns: {
        field: 'Field',
        type: 'Type',
        description: 'Description'
      },
      rows: {
        model: 'Controls dialog visibility.',
        title: 'Dialog title. Use the business object name.',
        width: 'Dialog width. Defaults to min(1120px, calc(100vw - 32px)).',
        loading: 'Whole-dialog loading state used to block repeated actions during refresh.',
        totals:
          'The summary area shows total and selected counts by default and passes them to actions, summary, and footer slots.',
        showFooter: 'Defaults to false. Enable it for picker dialogs that need confirm/cancel closure.',
        filters: 'Filter form region, usually containing query-form.',
        summary: 'Custom summary region with total, selectedCount, and loading slot props.',
        actions: 'Bulk action button region. Do not reuse main-page toolbar-actions.',
        table:
          'Table viewport region. Use HynTable for backend-paged or small pages; use HynVirtualTable only for large client-resident lists.',
        pagination: 'Pagination region. Place the project pagination component directly.',
        footer: 'Overrides the default footer when showFooter is enabled.'
      }
    },
    rules: {
      kicker: 'Do / Don’t',
      title: 'Boundary Rules',
      description:
        'The value of the table dialog is layout protocol convergence, not moving business logic into a global component.',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        listDialogs: 'Use HynTableDialog for list dialogs such as logs, audits, authorization, and pickers.',
        queryForm: 'Keep using the project query-form inside `#filters`.',
        tableSlot:
          'Use HynTable in `#table` by default; switch to HynVirtualTable only for large client-resident lists.',
        selectedKeys:
          'Keep selected keys controlled by the business page and derive bulk buttons from selectedCount or local computed state.'
      },
      dontItems: {
        nestedDialog: 'Do not wrap slot-built log or audit table dialogs with HynDialog.',
        toolbarActions: 'Do not reuse main-page `.toolbar-actions` inside the dialog.',
        overrideStyles:
          'Do not override `.hyn-table-dialog`, `.hyn-table`, or `.data-table` global protocols from business pages.',
        formMigration: 'Do not migrate create/edit forms to HynTableDialog.'
      }
    }
  },
  virtualTable: {
    hero: {
      kicker: 'Data Display',
      title: 'HynVirtualTable',
      description:
        'For large flat lists, authorization dialogs, logs, and audit tables. It renders only rows near the viewport to reduce scrolling and switching cost from large DOM trees while keeping visual alignment with HynTable.',
      pills: {
        virtualScroll: 'Virtual scroll',
        flatLargeData: 'Flat large data',
        crossPageSelection: 'Cross-page selection',
        visualProtocol: 'Unified visual protocol'
      }
    },
    metrics: {
      rendering: {
        label: 'Rendering',
        value: 'Virtual',
        note: 'Powered by TanStack Virtual and renders only rows near the viewport.'
      },
      rowHeight: {
        label: 'Default Row Height',
        value: '48px',
        note: 'Must stay visually consistent with normal tables and tree tables.'
      },
      useCase: {
        label: 'Use Case',
        value: 'Large',
        note: 'Authorization dialogs, logs, audits, and entity candidate lists with large flat datasets.'
      }
    },
    live: {
      kicker: 'Live Sample',
      title: 'Large Flat Table Sample',
      description:
        'The sample keeps up to 5000 rows. DOM row count is controlled by viewport and overscan instead of total data size.',
      emptyText: 'No virtual table data',
      columns: {
        id: 'ID',
        userName: 'User Name',
        roleName: 'Role Name',
        status: 'Status',
        remark: 'Description',
        action: 'Action'
      },
      actions: {
        edit: 'Edit',
        delete: 'Delete'
      },
      demoRow: {
        userName: 'Demo User {index}',
        adminRole: 'System Admin',
        userRole: 'General Role',
        normal: 'Normal',
        disabled: 'Disabled',
        remark: 'Virtual row {index}, used to verify scrolling, tooltips, and action-cell visuals.'
      }
    },
    howTo: {
      kicker: 'How-to',
      title: 'Basic Usage',
      description:
        'Virtual tables use the virtual-column contract `title/field`; do not mix it with the normal HynTable `label/prop` contract.',
      boundaryTitle: 'Usage Boundary',
      boundaryDescription:
        'Use HynVirtualTable only for flat large-data scenarios users can feel. Do not force sorting, merged cells, or complex native table behavior into a virtual table. Normal paged CRUD should continue using HynTable.',
      codeTitle: 'Vue Template',
      code: `<hyn-virtual-table
  v-model:selected-row-keys="selectedUserKeys"
  :rows="userRows"
  :columns="userTableColumns"
  :row-key="getUserRowKey"
  :visible-row-count="10"
  selection
  empty-text="No user data"
  {'@'}selection-change="handleUserSelectionChange"
/>

const userTableColumns: HynVirtualTableColumn<UserVO>[] = [
  {'{'} key: 'userName', title: 'User Name', field: 'userName', minWidth: 180 {'}'},
  {'{'} key: 'nickName', title: 'Nickname', field: 'nickName', minWidth: 160 {'}'},
  {'{'} key: 'status', title: 'Status', field: 'status', width: 100, align: 'center', slot: 'status' {'}'}
];`
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Virtual Table Template',
      description:
        'Copy this pattern for large client-resident flat lists such as authorization candidates, audit logs, and entity pickers.',
      codeTitle: 'HynVirtualTable template',
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
  empty-text="No user data"
  {'@'}selection-change="handleUserSelectionChange"
  {'@'}select-all-change="handleSelectAllChange"
/>

const userTableColumns: HynVirtualTableColumn<UserVO>[] = [
  {'{'} key: 'userName', title: 'User Name', field: 'userName', minWidth: 180 {'}'},
  {'{'} key: 'nickName', title: 'Nickname', field: 'nickName', minWidth: 160 {'}'},
  {'{'} key: 'phonenumber', title: 'Mobile', field: 'phonenumber', minWidth: 150 {'}'},
  {'{'} key: 'status', title: 'Status', field: 'status', width: 100, align: 'center', slot: 'status' {'}'},
  {'{'}
    key: 'action',
    title: 'Action',
    sticky: 'right',
    align: 'center',
    actions: [
      {'{'} key: 'edit', label: 'Edit', icon: Edit, permissions: ['system:user:edit'], onClick: handleUpdate {'}'}
    ]
  {'}'}
];`
    },
    recipes: {
      kicker: 'Recipes',
      title: 'Performance and Interaction Recipes',
      description: 'Column width, row height, and rowKey must be stable, otherwise scroll measurement will jitter.',
      items: {
        rowKey: {
          kind: 'rowKey',
          focus: 'required',
          title: 'Stable Row Key',
          description: 'Row reuse, selection state, and scroll positioning all depend on a stable key.',
          code: `const getUserRowKey = (row: UserVO): HynVirtualTableKey => {'{'}
  return row.userId;
{'}'};`
        },
        height: {
          kind: 'height',
          focus: '10 rows',
          title: 'Stable Viewport',
          description:
            'Normal scenarios show 10 rows by default; dialogs, detail panels, and embedded containers can adjust visibleRowCount or height.',
          code: `<hyn-virtual-table :visible-row-count="8" :row-height="48" :overscan="12" />`
        },
        selection: {
          kind: 'selection',
          focus: 'controlled',
          title: 'Controlled Selection',
          description: 'Keep selected primary keys in selectedRowKeys instead of binding selection state to DOM rows.',
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
          title: 'Unified Action Column',
          description: 'Virtual-table action columns also use the HYN action cell so visuals match normal tables.',
          code: `{'{'}
  key: 'action',
  title: 'Action',
  sticky: 'right',
  align: 'center',
  actions: [
    {'{'} key: 'edit', label: 'Edit', icon: Edit, permissions: ['system:user:edit'], onClick: handleUpdate {'}'}
  ]
{'}'}`
        }
      }
    },
    reference: {
      kicker: 'Reference',
      title: 'Field Reference',
      description:
        'The virtual-table API serves performance-sensitive scenarios. Keep column widths and row height stable to avoid scroll measurement jitter.',
      aria: 'HynVirtualTable API',
      columns: {
        field: 'Field',
        type: 'Type',
        description: 'Description'
      },
      rows: {
        rows: 'Large flat row data. DOM render volume is determined by viewport height and overscan.',
        columns: 'Virtual table column config using title, field, width, minWidth, slot, and actions.',
        rowKey: 'Stable primary key for virtual row reuse, selection state, and current-row checks.',
        visibleRowCount:
          'Default visible row count. Defaults to 10 and creates a stable viewport when the parent has no fixed height.',
        height:
          'Explicit table height. Takes precedence over visibleRowCount and can be 100% when filling a parent container.',
        rowHeight: 'Estimated virtual row height. Defaults to 48 and must be close to the visual row height.',
        overscan:
          'Extra rows rendered outside the viewport. Higher values make scrolling steadier but increase DOM size.',
        selection: 'Enables selection and multi-select behavior. Disabled rows are controlled by rowDisabled.',
        fit: 'Enabled by default. Columns share remaining space; when disabled, horizontal scrolling follows total column width.',
        actions: 'Reuses the unified HYN action button cell. Do not hand-code action button styles in business pages.'
      }
    },
    rules: {
      kicker: 'Do / Don’t',
      title: 'Usage Boundary',
      description:
        'Virtual tables solve large-DOM scrolling cost. They are not a universal replacement for normal tables.',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        largeLists:
          'Use it for flat lists with hundreds of rows or more, such as authorization dialogs, logs, audits, and entity selection.',
        rowKey: 'Always provide a stable rowKey; do not use array indexes.',
        widths: 'Use width/minWidth for columns and actions for action columns.',
        measure: 'Call the exposed measure() after large data or container-size changes.'
      },
      dontItems: {
        pagedCrud: 'Do not migrate ordinary paged CRUD to virtual tables by default.',
        nativeTableFeatures: 'Do not force sorting, merged cells, or complex native table behavior into it.',
        dynamicHeight: 'Do not let row height change with content or virtual scrolling will jitter.',
        customActionStyles: 'Do not hand-code action column button styles in pages.'
      }
    }
  },
  virtualTreeTable: {
    hero: {
      kicker: 'Data Display',
      title: 'HynVirtualTreeTable',
      description:
        'For large tree scenarios such as departments, organizations, regions, categories, and permissions. It renders only rows near the viewport, while useHynVirtualTreeTable owns expansion and lazy-loading state so business pages do not stack tree algorithms and large DOM.',
      pills: {
        virtualScroll: 'Virtual scroll',
        treeIndex: 'Tree index',
        lazyLoading: 'Lazy loading',
        innerScroll: 'Inner scroll'
      }
    },
    metrics: {
      realDom: {
        label: 'Real DOM',
        value: 'Viewport + overscan',
        note: 'Expanded node count does not increase DOM linearly.'
      },
      expansionState: {
        label: 'Expansion state',
        value: 'Set',
        note: 'Expanded keys are maintained independently and are cheap to leave.'
      },
      dataMode: {
        label: 'Data mode',
        value: 'Full / Lazy',
        note: 'Choose full or lazy loading based on backend capability.'
      }
    },
    live: {
      kicker: 'Live Sample',
      title: 'Running Sample',
      description:
        'Expanding root level does not create full DOM. Real DOM row count is still decided by viewport height and overscan.',
      selectedCount: '{count} selectable nodes selected.',
      expandRootLevel: 'Expand Root Level',
      collapseAll: 'Collapse All',
      emptyText: 'No organization data',
      columns: {
        name: 'Organization Name',
        owner: 'Owner'
      },
      status: {
        enabled: 'Enabled',
        disabled: 'Disabled'
      },
      owners: {
        platform: 'Platform Team',
        frontend: 'Frontend Team',
        delivery: 'Delivery Team',
        experience: 'Experience Team',
        architecture: 'Architecture Team',
        operations: 'Operations Team',
        regionOne: 'Region One Team',
        data: 'Data Team'
      },
      rows: {
        root: { name: 'Headquarters Organization' },
        rdCenter: { name: 'R&D Center' },
        deliveryCenter: { name: 'Delivery Center' },
        componentPlatform: { name: 'Component Platform' },
        performanceGovernance: { name: 'Performance Governance' },
        regionalOrg: { name: 'Regional Organization' },
        eastChina: { name: 'East China Region' },
        archive: { name: 'Historical Archive' }
      }
    },
    howTo: {
      kicker: 'How-to',
      title: 'Basic Usage',
      description: 'Bind only the visible rows returned by the hook, and mark the primary tree column with tree: true.',
      templateTitle: 'Template',
      templateDescription:
        'rows must be visibleRows, not the raw backend array. toggle-row usually binds directly to the hook toggleRow.',
      templateCodeTitle: 'Vue Template',
      hookTitle: 'Hook',
      hookDescription:
        'getRowKey and getParentKey are the core of the tree index. batchSize controls how many root nodes each frame processes during batch expansion.',
      hookCodeTitle: 'Composition API'
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Standard Tree Table Template',
      description:
        'Departments, organizations, and permission tree tables should copy this combination first: the component renders only visible rows, and the hook owns tree index plus expansion state.',
      codeTitle: 'HynVirtualTreeTable + hook'
    },
    reference: {
      kicker: 'Reference',
      title: 'Component API',
      description: 'The component API stays small and stable, while complex state is concentrated in the hook.',
      aria: 'HynVirtualTreeTable API',
      columns: {
        field: 'Field',
        type: 'Type',
        description: 'Description'
      },
      rows: {
        rows: 'Visible rows returned by the hook, not the raw backend array.',
        columns: 'Column config. The primary tree column must set tree: true.',
        actions:
          'Recommended standard action-area config. The component includes Element Plus Tooltip/Button and permission checks.',
        width: 'Special action column width can be explicit; by default it is inferred from actions.length.',
        loading: 'Initial query or full refresh loading state. Skeleton appears while empty data is loading.',
        busy: 'Non-API main loading state such as batch expansion or frame-sliced tasks.',
        busyText: 'Task text beside the thin top progress bar, for example "Expanding root level 60%".',
        progress: 'Progress from 0 to 1 for the thin top progress bar.',
        visibleRowCount:
          'Default visible row count is 10. When the parent has no fixed height, it creates a stable viewport and prevents rendering all visible rows after expansion.',
        height:
          'Explicit tree-table height. When passed, it takes priority over visibleRowCount; standard table panels can still let the page shell own 100% height.',
        rowHeight: 'Estimated virtual row height. Default is 48 and must stay close to visual row height.',
        overscan:
          'Extra rows rendered outside the viewport. Default is 12; larger values make scrolling smoother but increase DOM.',
        selectedRowKeys:
          'Controlled selected primary keys via v-model:selected-row-keys. Ancestor half-checked state is visual only and is not written to this array.',
        selection:
          'Enables selection boxes inside the tree column and multi-select. Single-select scenarios pass multiple=false.',
        rowDisabled: 'Disables selection by business row. Disabled rows do not participate in header batch selection.',
        selectionChange:
          'Emitted when a single row selection changes, returning the row, checked state, and all selected keys.',
        selectAllChange:
          'Emitted when the multi-select header changes. It affects only currently visible and enabled tree rows.',
        toggleRow: 'Emitted when the expand button is clicked, usually bound directly to the hook toggleRow.'
      }
    },
    visual: {
      kicker: 'Visual Contract',
      title: 'Table Visual Contract',
      description:
        'HynVirtualTreeTable must keep the same user-visible table experience as HynTable and HynVirtualTable.',
      items: {
        rows: {
          kind: 'Rows',
          title: 'Unified Row Height',
          description:
            'Normal tables, virtual tables, and virtual tree tables must share font size, row height, hover, and current-row background.'
        },
        actions: {
          kind: 'Actions',
          title: 'Unified Action Column',
          description:
            'Tree table action buttons still reuse HynTableActionCell. Do not hand-write button size or tooltip in pages.'
        },
        selection: {
          kind: 'Selection',
          title: 'Tree-column Selection',
          description:
            'The checkbox belongs to the primary tree column and sits after the expand button. selectedRowKeys drives checked state, and visible ancestors show half-check when children are selected.'
        },
        fixed: {
          kind: 'Fixed',
          title: 'Opaque Fixed Column',
          description:
            'During horizontal scrolling, sticky action columns need stable backgrounds and must inherit hover plus selected state.'
        },
        tooltip: {
          kind: 'Tooltip',
          title: 'Tooltip on Truncation',
          description:
            'Primary tree columns and normal text columns must keep tooltip strategy when truncated. Non-overflowing content should not show meaningless tooltips.'
        }
      }
    },
    lazy: {
      kicker: 'Lazy Loading',
      title: 'Lazy Loading Config',
      description:
        'Lazy loading reduces API payload and frontend memory, not only DOM. Without lazy, the table remains in full-data mode.',
      conditionsTitle: 'Enable Conditions',
      conditionsDescription:
        'The backend must return a child-node marker and provide an API for direct children by parent node.',
      codeTitle: 'Lazy Hook',
      aria: 'lazy config reference',
      rows: {
        lazy: 'Omitted for full-data mode; passed to load children when a parent node is expanded.',
        hasChildren: 'Usually maps hasChildren, childCount > 0, or leaf === false.',
        loadChildren: 'Called when expanding. It must return the direct child array for the current node.',
        loadedKeys:
          'Maintained by the hook. Records successfully loaded nodes to avoid repeated requests for the same parent.',
        loadingKeys: 'Maintained by the hook. Currently loading nodes show inline spinner state.',
        loadErrorByKey:
          'Maintained by the hook. Load failure displays Load failed, while the complete error is exposed through title.'
      }
    },
    backend: {
      kicker: 'Backend Contract',
      title: 'Backend Response Contract',
      description:
        'Full mode returns all nodes at once. Lazy mode separates the root API and child API, and the child API returns only direct children of the current parent.',
      fullTitle: 'Full Mode',
      fullDescription: 'Fits hundreds to thousands of nodes. The frontend builds the tree from deptId / parentId.',
      fullCodeTitle: 'GET /system/dept/list',
      lazyTitle: 'Lazy Mode',
      lazyDescription:
        'Fits thousands to tens of thousands of nodes. Parent nodes must carry hasChildren or an equivalent field.',
      lazyCodeTitle: 'GET /system/dept/children?parentId=100'
    },
    rules: {
      kicker: 'Do / Don’t',
      title: 'Tree Table Generation Rules',
      description:
        'The key is not the component tag. It is visible rows, stable parent/child keys, and lazy-loading failure state.',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        hook: 'When a list API returns an array, prefer `useHynVirtualTreeTable` to build visible rows.',
        treeColumn: 'The primary tree column must set `tree: true`.',
        selectionKeys: 'Persist selection state through `v-model:selected-row-keys`.',
        lazyState: 'Lazy loading must preserve loading, loaded, and error state.',
        actions: 'Keep using `actions` for the action column instead of hand-writing button styles.'
      },
      dontItems: {
        rawTreeTable: 'Do not generate `el-table tree-props + default-expand-all` as the default solution.',
        indexKey: 'Do not use array indexes as row keys or parent keys.',
        selectionColumn: 'Do not generate a separate leftmost selection column for tree tables.',
        expandThousands: 'Do not expand thousands of nodes by default.',
        swallowLazyError: 'Do not silently swallow lazy-loading API failures.',
        guessBackendNames:
          'Do not guess English from backend names such as departments, organizations, or regions. Real business trees need backend keys or localized fields.'
      }
    }
  },
  treeSelect: {
    hero: {
      kicker: 'Data Entry / Tree Select',
      title: 'HynTreeSelect',
      description:
        'HynTreeSelect is the generic tree selection field. It owns hierarchy display and virtual flat selection, while business-specific data loading stays in wrappers such as HynDeptSelect.',
      pills: {
        treeMode: 'tree mode',
        flatMode: 'virtual flat',
        localSearch: 'local search',
        formField: 'HynForm field'
      }
    },
    live: {
      kicker: 'Live Example',
      title: 'Tree Single-select, Tree Multi-select, And Flat Multi-select',
      description:
        'The same tree data can keep hierarchy through Tree V2 or render as a Select V2 virtual flat list through flatten.',
      fields: {
        parentId: 'Parent Node',
        nodeIds: 'Independent Nodes',
        linkedNodeIds: 'Linked Nodes',
        flatNodeIds: 'Flat Nodes'
      },
      placeholders: {
        parentId: 'Select parent node',
        nodeIds: 'Select nodes',
        linkedNodeIds: 'Select nodes',
        flatNodeIds: 'Select nodes'
      },
      nodes: {
        root: 'Platform Node',
        childA: 'Portal Menu',
        childB: 'Console Menu',
        group: 'Business Node',
        childC: 'Approval Center'
      }
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Field Configuration',
      description:
        'Use treeSelect for generic tree fields in config forms. Keep department fields on deptSelect and remote paged entities on remoteSelect.',
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
      kicker: 'Reference',
      title: 'Field API',
      description:
        '`treeSelect` is the generic tree selection protocol. Hierarchy mode uses Tree V2, while `flatten: true` uses a Select V2 virtual flat list and frontend local search.',
      aria: 'HynTreeSelect field API',
      columns: {
        field: 'Field',
        type: 'Type',
        description: 'Description'
      },
      rows: {
        data: 'Tree node data owned by the caller. Business API loading does not belong in HynTreeSelect.',
        props: 'Field mapping for value, label, children, and disabled.',
        multiple: 'When true, hierarchy mode shows checkboxes and writes an array of node keys.',
        linkage:
          'Sets the initial hierarchy mode. Enabling it cascades already selected parents to all descendants; disabling it preserves the actual checkedKeys and clears stale half-check state.',
        onLinkageChange:
          'Runs after the hierarchy control changes. Use it to synchronize a backend strict-selection field in the form model.',
        flatten:
          'When true, switches to a virtual flat list for large-tree multi-select and independent selection. The flat index is built across frames to avoid blocking dialog open.',
        filterable:
          'Allows keyword filtering. Tree mode uses Tree V2 local filtering; flat mode filters loaded data across frames.',
        filterDisabled: 'Filters disabled nodes when true.',
        dropdownWidth:
          'Controls the Tree V2 dropdown width in hierarchy mode. Select V2 flat mode still follows the control width.',
        loading: 'External loading state; async data loading shows loading copy in the dropdown.'
      }
    },
    rules: {
      kicker: 'Rules',
      title: 'How To Use It',
      description:
        'HynTreeSelect only owns tree selection display. It does not own business APIs, paged entity echo, or permission-tree editing.',
      doTag: 'Do',
      dontTag: "Don't",
      doItems: {
        genericTree: 'Use treeSelect for loaded generic trees such as menus, categories, and regions.',
        flatten:
          'Use hierarchy mode when context matters; use flatten for large-tree independent multi-select without hierarchy ambiguity.',
        deptWrapper:
          'Use deptSelect for system departments so department API loading and caching stay in the business wrapper.'
      },
      dontItems: {
        remoteEntity: 'Do not put remote paged entities such as users, roles, or posts into treeSelect.',
        backendFetch: 'Do not make HynTreeSelect know business endpoint paths.',
        permissionEditor: 'Do not replace a permission-tree editor with a normal tree dropdown.'
      }
    },
    acceptance: {
      kicker: 'Acceptance',
      title: 'Verification Checklist',
      description: 'Check these points when changing tree selection behavior or adding a generic tree field.',
      items: {
        tree: 'Tree mode uses Tree V2 and preserves hierarchy, linkage behavior, dropdownWidth, and bounded dropdown height.',
        flat: 'Flatten mode uses a virtual flat list, search does not request the backend, and filtering does not block the main thread for long.',
        loading: 'Async data loading shows feedback instead of a blank no-response dropdown.',
        types: 'Business tree VO types can be passed directly without an index signature or page conversion.'
      }
    }
  },
  deptSelect: {
    hero: {
      kicker: 'Data Entry / Department Field',
      title: 'HynDeptSelect',
      description:
        "HynDeptSelect centralizes the system department tree dropdown. HynForm and HynDialog consume it through `type: 'deptSelect'`, so pages only configure the field and do not repeat department tree loading logic.",
      pills: {
        formField: 'HynForm field',
        singleMulti: 'single / multiple',
        disabledFilter: 'disabled filtering',
        typedConfig: 'typed config'
      }
    },
    live: {
      kicker: 'Live Example',
      title: 'Single, Tree Multi-select, And Flat Multi-select',
      description:
        'The same field type supports scalar single-select values, Tree V2 multi-select, and Select V2 flat multi-select. Department names come from the backend tree and are displayed as-is.',
      fields: {
        deptId: 'Department',
        deptIds: 'Linked Departments',
        flatDeptIds: 'Flat Departments'
      },
      placeholders: {
        deptId: 'Select department',
        deptIds: 'Select departments',
        flatDeptIds: 'Select departments'
      }
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Field Configuration',
      description: 'Use this field in HynDialog or HynForm whenever a form needs the system department dropdown.',
      codeTitle: 'HynDialog dept field',
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
      kicker: 'Reference',
      title: 'Field API',
      description:
        '`deptSelect` is a typed HynForm field. It owns the `/system/user/deptTree` data source and exposes only form-level behavior switches.',
      aria: 'HynDeptSelect field API',
      columns: {
        field: 'Field',
        type: 'Type',
        description: 'Description'
      },
      rows: {
        type: 'Enables the department selector renderer inside HynForm and HynDialog.',
        multiple: 'When true, the field writes an array of department keys. Hierarchy mode shows Tree V2 checkboxes.',
        flatten:
          'When true, renders departments with a Select V2 virtual flat list and filters against cached department data on the frontend. Use it for independent multi-select fields that should avoid hierarchy ambiguity. Flat indexing and search both run across frames.',
        filterDisabled:
          'Filters backend disabled department nodes by default. Set false only when a business form must show disabled nodes.',
        linkage:
          'Sets the initial department hierarchy mode. Enabling it cascades selected departments to descendants; disabling it preserves the actual checked department keys.',
        onLinkageChange:
          'Runs after the hierarchy control changes so role and similar forms can synchronize their strict-selection field.',
        filterable: 'Allows local keyword filtering in the loaded department tree.',
        clearable: 'Shows the clear button and writes an empty value according to single or multiple mode.',
        collapseTags: 'Collapses tags in multiple mode so the form row height stays stable.',
        maxCollapseTags: 'Controls how many tags remain visible before collapse.',
        dropdownWidth:
          'Controls the Tree V2 department dropdown width in hierarchy mode. Select V2 flat mode still follows the control width.',
        teleported: 'Controls whether the dropdown layer is teleported to body.'
      }
    },
    rules: {
      kicker: 'Rules',
      title: 'How To Use It',
      description:
        'This selector is for system departments in ordinary form fields, not a general tree picker or permission-tree editor.',
      doTag: 'Do',
      dontTag: "Don't",
      doItems: {
        fieldType: "Use `type: 'deptSelect'` in HynForm or HynDialog field arrays.",
        multiple: 'Use `multiple: true` only when the backend field is confirmed as a department key array.',
        disabled: 'Keep disabled-node filtering on unless the business contract explicitly needs disabled departments.'
      },
      dontItems: {
        pageTree: 'Do not load `/system/user/deptTree` in each page just to feed a form department dropdown.',
        componentProps: 'Do not add generic componentProps escapes for department behavior.',
        guessLabels: 'Do not translate backend department names on the frontend; display the returned label.'
      }
    },
    acceptance: {
      kicker: 'Acceptance',
      title: 'Verification Checklist',
      description: 'Check these points when changing the department selector or adding a new form usage.',
      items: {
        single: 'Single-select writes one department key or undefined when cleared.',
        multiple: 'Multi-select writes a department key array and keeps tags collapsed.',
        flatten:
          '`flatten: true` uses a virtual flat dropdown. Enabling `linkage` immediately cascades selected parents; disabling it preserves actual checked keys. Neither transition resets expansion state.',
        disabled: 'Disabled departments are filtered by default without mutating the shared tree cache.',
        i18n: 'Labels and placeholders still come from page or docs i18n keys; backend department names remain raw business data.'
      }
    }
  },
  form: {
    hero: {
      kicker: 'Data Entry / Form Protocol',
      title: 'HynForm',
      description:
        'HynForm is not a replacement for Element Plus Form. It is the project form protocol for unified label width, field grid, control width, multi-select tag alignment, input-number controls, and error scrolling. Normal forms declare fields instead of scattering form CSS across pages.',
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
        note: 'Converges the project form protocol without rewriting Element Plus controls.'
      },
      dialog: {
        label: 'Dialog',
        value: 'Composed',
        note: 'HynDialog composes HynForm internally and shares the same field config contract.'
      },
      guard: {
        label: 'Guard',
        value: 'Linted',
        note: 'Risky deep overrides and private dialog form classes are guarded by lint.'
      }
    },
    live: {
      kicker: 'Live Sample',
      title: 'Standard Form Protocol',
      description:
        'Watch label/control vertical alignment, the first multi-select tag padding, right-side number controls, and validation feedback.',
      ownerPlaceholder: 'Select owner',
      ownerOptions: {
        platform: 'Platform Admin',
        business: 'Business Owner'
      },
      validate: 'Validate',
      reset: 'Reset',
      validation: {
        idle: 'Not validated',
        passed: 'Validation passed',
        failed: 'Complete required fields'
      },
      fields: {
        appName: 'Application Name',
        appCode: 'Application Code',
        priority: 'Display Order',
        status: 'Status',
        tags: 'Tags',
        owner: 'Owner',
        remark: 'Remark'
      },
      placeholders: {
        appName: 'Enter application name',
        appCode: 'Enter application code'
      },
      tooltips: {
        appCode: 'The code is usually not changed after it is saved.'
      },
      rules: {
        appName: 'Application name is required',
        appCode: 'Application code is required'
      },
      status: {
        enabled: 'Enabled',
        disabled: 'Disabled'
      },
      tags: {
        core: 'Core System',
        external: 'External Access',
        frequent: 'High Frequency'
      }
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Standard Form Template',
      description:
        'Copy this structure for standalone forms, drawer forms, and non-dialog configuration forms. Create/edit dialogs still prefer HynDialog.',
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
      kicker: 'Reference',
      title: 'Component API',
      description:
        'Field types reuse HynDialog field rendering. HynDialogField is the shared public type for dialog forms.',
      aria: 'HynForm API',
      columns: {
        field: 'Field',
        type: 'Type',
        description: 'Description'
      },
      rows: {
        model: 'Form data model owned by the caller.',
        fields: 'Field config array and the only layout entry for ordinary label/value forms.',
        rules: 'Element Plus validation rules. Field required marks can add base rules.',
        labelWidth: 'Unified label width. Defaults to 96px.',
        columns: 'Form column count. Defaults to two columns and collapses to one column on mobile.',
        loading: 'Form loading state. Fields are disabled consistently while loading.',
        validate:
          'Validation method exposed to HynDialog or callers. On failure it scrolls to the first invalid field when configured.',
        getFormRef: 'Access to the underlying Element Plus Form instance for rare complex scenarios.'
      }
    },
    boundary: {
      kicker: 'Boundary',
      title: 'Boundary with HynDialog',
      description:
        'HynForm owns the form protocol; HynDialog owns the dialog shell. Complex option editors should not be forced into fields.',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        dialogFields:
          'Keep using HynDialog + fields for normal create/edit dialogs; HynDialog owns standard two-column sizing.',
        inlineForm: 'Use HynForm directly for standard forms outside dialogs.',
        singleColumn:
          'Use columns=1 only when a small dialog truly needs a compact form; do not squeeze two columns into a narrow modal.',
        complexSlot:
          'Carry complex regions through HynForm slots, but do not add page-level deep overrides for Element Plus.',
        specialEditor:
          'Extract option editors such as Cron into dedicated components; keep radio labels and input controls as separated layout units.'
      },
      dontItems: {
        extraClasses: 'Do not add `.dialog-form`, `.dialog-grid-form`, or `.permission-dialog-form` in pages.',
        deepOverrides: 'Do not write `:deep(.el-form-item)` or `:deep(.el-input-number)` in pages.',
        radioLayout:
          'Do not use a radio label as a full-row flex container and stuff extra interactive controls into it.',
        dialogCss: 'Do not maintain another set of form CSS around HynDialog for one page.'
      }
    },
    complexEditor: {
      kicker: 'Complex Editor',
      title: 'Cron Sample Boundary',
      description:
        'Configuration fields fit label/value forms. A visual Cron editor is a row-level option editor and should use a dedicated component.',
      codeTitle: 'Cron visual editor boundary',
      code: `<hyn-dialog v-model="visible" title="Cron Expression" width="900px" {'@'}confirm="confirmExpression">
  <div class="quartz-cron-dialog">
    <el-input v-model="draftExpression" />
    <quartz-cron-visual-editor
      v-model:active-tab="activeTab"
      :model="cronModel"
      :disabled="!visualEditable"
    />
  </div>
</hyn-dialog>

<!-- Key points:
1. HynDialog only owns the dialog shell.
2. Cron visual editing is not a normal label/value form, so do not force it into HynForm fields.
3. Radio copy and input/select controls are siblings controlled by the dedicated component layout. -->`
    },
    acceptance: {
      kicker: 'Acceptance',
      title: 'Acceptance Checklist',
      description:
        'After form governance work, check these objective signals instead of relying on page-level patches.',
      visualTitle: 'Visual Acceptance',
      items: {
        labelCenter: 'Labels and input controls are vertically centered within the 32px control height.',
        selectTag: 'The first multi-select tag keeps normal left padding and does not stick to the border.',
        inputNumber: 'input-number with controls-position="right" still has half-height up/down buttons.',
        responsive: 'Two-column fields collapse to one column on narrow screens without overlapping content.'
      },
      codeTitle: 'Style Guard',
      code: `pnpm run lint:hyn-form

# The guard blocks new:
src/views/** :deep(.el-form-item)
src/views/** :deep(.el-input-number)
src/views/** .dialog-form / .dialog-grid-form / .permission-dialog-form
src/views/** <el-dialog>`
    }
  },
  cronExpression: {
    hero: {
      kicker: 'Data Entry / Cron Field',
      title: 'HynCronExpression',
      description:
        'HynCronExpression is the Quartz Cron expression field. Normal forms treat it as one lightweight input field, while the visual builder, Cron parser, and next-run preview stay out of the main form path and are preloaded during idle time.',
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
        note: 'Forms only own the expression string and do not own builder internals.'
      },
      bundle: {
        label: 'Bundle',
        value: 'split',
        note: 'The builder and croner/cronstrue stay in independent chunks and preload from the field.'
      },
      scroll: {
        label: 'Scroll',
        value: 'single',
        note: 'Dialog scrolling is owned by HynDialog body; inner regions do not compete for scroll.'
      }
    },
    live: {
      kicker: 'Live Sample',
      title: 'Cron Field in a Form',
      description:
        'The field shows only an input and a builder button. Complex editing happens inside the dialog and does not occupy normal form layout.',
      demoJobName: 'Sync Organization Structure',
      fields: {
        jobName: 'Job Name',
        cronExpression: 'Cron Expression'
      }
    },
    aiCopy: {
      kicker: 'AI Copy Block',
      title: 'Field Configuration',
      description:
        "Business pages should not hand-code Cron slots. Normal create/edit dialogs connect the global component through `type:'cron'`.",
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
      kicker: 'Reference',
      title: 'Field Config Reference',
      description:
        "`type:'cron'` is a form-field contract, not the visual editor contract. Business pages declare the expression field and minimal copy only.",
      aria: 'HynCronExpression field config reference',
      columns: {
        field: 'Field',
        type: 'Type',
        description: 'Description'
      },
      rows: {
        key: 'Unique field id, usually matching prop.',
        label: 'HynForm label, such as Cron Expression.',
        prop: 'Bound model field. The value must be a Quartz Cron expression string.',
        type: 'Enables the HynCronExpression renderer. Business pages should not replace it with a handwritten slot.',
        span: 'Use full for Cron fields so the expression input is not squeezed in a two-column grid.',
        contentLayout: 'Use inline so the input and button keep normal control-row semantics.',
        placeholder: 'Overrides the input placeholder. When absent, the global i18n default is used.',
        buttonText: 'Overrides the builder button text. When absent, the global Generate label is used.',
        rules:
          'Put ordinary required rules in HynForm rules. Run Quartz semantic validation through getQuartzCronSummary before submit.',
        disabled: 'When disabled, both the input and builder button are disabled.'
      }
    },
    internals: {
      kicker: 'Internals',
      title: 'Internal Component Responsibilities',
      description:
        'These components are private implementation details of HynCronExpression. Business pages should not import them directly; the docs list them so people and AI keep boundaries clear.',
      parts: {
        publicField: {
          layer: 'Public Field',
          name: 'index.vue',
          description:
            'Lightweight form field component that owns v-model, the builder button, focus spacing, and lazy dialog loading.',
          points: {
            model: 'The public entry is `<hyn-cron-expression>`.',
            asyncDialog: 'The dialog is loaded with defineAsyncComponent.',
            preload: 'Hover, focus, and idle preload reuse the same Promise.'
          }
        },
        dialogShell: {
          layer: 'Dialog Shell',
          name: 'HynCronExpressionDialog.vue',
          description:
            'Uses HynDialog as the shell and owns parsing, visual-model sync, generated output, and next-run preview.',
          points: {
            hynDialog: 'Visual and notes regions do not create extra scroll containers.',
            rawMode: 'Advanced expressions enter raw mode instead of being rewritten.',
            copyChip: 'The copy action stays inside the generated-result chip.'
          }
        },
        visualBuilder: {
          layer: 'Visual Builder',
          name: 'HynCronVisualEditor.vue',
          description: 'Entry for the visual builder tabs and common Quartz patterns.',
          points: {
            sharedRows: 'All rows use the same row protocol.',
            dayTabs: 'Day-of-month and day-of-week are grouped but still share row structure.',
            modelOnly: 'It updates QuartzCronModel only and does not submit form fields directly.'
          }
        },
        rowProtocol: {
          layer: 'Row Protocol',
          name: 'CronOptionRow.vue',
          description: 'Unifies radio, option title, and parameter region in a three-column row.',
          points: {
            grid: 'The desktop grid is 24px / 156px / minmax(0, 1fr).',
            active: 'Active rows use restrained state color and a thin left edge.',
            mobile: 'Mobile layout collapses to radio plus single-column content.'
          }
        },
        parameterControl: {
          layer: 'Parameter Control',
          name: 'CronNumberUnit / CronValuePicker',
          description: 'Dedicated parameter controls for numeric units and grid multi-select values.',
          points: {
            shortLabels: 'Numeric inputs always show short labels and units.',
            validRange: 'Empty numeric values fall back to legal lower bounds.',
            controlWidth: 'Picker output is sorted by option order to keep expressions stable.'
          }
        },
        pureLogic: {
          layer: 'Pure Logic',
          name: 'cron.ts / quartzCron.ts',
          description: 'Public Cron helpers and pure Quartz model generation, parsing, summary, and preview logic.',
          points: {
            publicImport: "Business submit logic imports getQuartzCronSummary from `{'@'}/components/Hyn/cron` only.",
            advancedMode: 'Advanced valid expressions remain in raw mode.',
            splitChunk: 'Croner and cronstrue stay out of the normal form path.'
          }
        }
      }
    },
    coreCode: {
      kicker: 'Core Code',
      title: 'Key Code',
      description:
        'When AI edits Cron, start from these three pieces: public field, lazy dialog loading, and the visual row protocol. Do not copy old business-page slots.',
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
    label="Interval"
    unit="Minutes"
  />
  <cron-number-unit
    v-model="model[tab.key].intervalStart"
    label="Start Minute"
    unit="Minutes"
  />
</cron-option-row>`
    },
    boundary: {
      kicker: 'Boundary',
      title: 'Why Internals Do Not Use HynForm',
      description:
        'Cron seconds, minutes, hours, and days are mutually exclusive option editors, not label/value forms. Dedicated row protocol avoids nested forms, repeated labels, and scroll conflicts.',
      doTag: 'Do',
      dontTag: 'Don’t',
      doItems: {
        formCron: "Use `type:'cron'` in normal job or task forms.",
        rowProtocol: 'Keep visual rows as radio, option title, and parameter region.',
        shortLabels: 'Parameter controls must include short labels, such as every 5 minutes.',
        summaryValidation: 'Dynamically import getQuartzCronSummary before submit for final validation.',
        rawMode:
          'Keep advanced legal expressions parse-compatible and show raw-mode hints when they cannot be visually edited.'
      },
      dontItems: {
        businessSlot: 'Do not hand-code Cron input append buttons in business pages.',
        hynFormRows: 'Do not wrap every Cron editor row as a HynForm field.',
        longSelect: 'Do not regress specified values to long el-select multiple controls.',
        extraScroll: 'Do not create a new vertical scroll container inside the Cron dialog.'
      }
    },
    docsRule: {
      kicker: 'Documentation Rule',
      title: 'Documentation Maintenance Rules',
      description:
        'When adding or changing HYN components, component docs must change with code. These docs are a shared development contract for people and AI.',
      requiredTag: 'Required',
      forbiddenTag: 'Forbidden',
      requiredItems: {
        boundary: 'State when to use the component and when not to use it.',
        api: 'Document field config or props, emits, slots, and expose.',
        internals: 'List responsibilities of important internal components or functions.',
        copyableCode: 'Provide minimal realistic code that AI can copy.',
        acceptance: 'State visual, performance, and acceptance boundaries.'
      },
      forbiddenItems: {
        demoOnly: 'Do not publish only a demo without explaining fields.',
        sourceOnly: 'Do not write only "see source" and force the next person to reread everything.',
        privateBoundary: 'Do not omit boundaries of private subcomponents.',
        catalog: 'Do not add components without updating catalog.ts and HYN references.',
        oldPatterns: 'Do not keep obsolete page patterns as examples.'
      }
    }
  }
};
