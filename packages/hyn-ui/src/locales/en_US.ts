/** 独立 HYN 组件使用的通用交互和 Quartz 文案，不依赖业务系统语言包。 */
export default {

/** 组件交互文案由包提供，宿主无需复制原业务系统语言文件。 */
app: {
/** 配置式表单与浮层共享的宿主无关交互词汇。 */
common: {
    /** 自动操作列的表头名称。 */
    action: 'Actions',
    /** 创建新记录的入口，区别于修改已有记录。 */
    add: 'Add',
    /** 退出当前步骤并返回上一级页面。 */
    back: 'Back',
    /** 清除当前字段选择的无障碍名称。 */
    clear: 'Clear',
    /** 取消当前交互，不提交编辑草稿。 */
    cancel: 'Cancel',
    /** 只读或辅助弹窗的退出动作。 */
    close: 'Close',
    /** 提交表单或确认实体选择的统一动作。 */
    confirm: 'Confirm',
    /** 标识需要删除确认的移除动作。 */
    delete: 'Delete',
    /** 完成删除和本地状态更新后才反馈成功。 */
    deleteSuccess: 'Deleted successfully',
    /** 只读详情入口，与可写编辑入口分别标记。 */
    detail: 'Details',
    /** 修改已有记录时保留业务主键。 */
    edit: 'Edit',
    /** 日期范围上界的占位提示。 */
    endDate: 'End date',
    /** 导出当前数据范围，不与导入动作混用。 */
    export: 'Export',
    /** 筛选区域已展开时的收起动作。 */
    hideSearch: 'Hide search',
    /** 从外部文件合并记录的入口。 */
    import: 'Import',
    /** 位置序号不能替代业务主键。 */
    index: 'No.',
    /** 首次读取数据时与无数据状态区分。 */
    loading: 'Loading...',
    /** 追加候选时保留旧选项并显示分页加载状态。 */
    loadingMore: 'Loading more...',
    /** 折叠候选之外的进一步操作入口。 */
    more: 'More',
    /** 加载完成且结果为空时才显示。 */
    noData: 'No data',
    /** 布尔假值与取消交互分别翻译。 */
    no: 'No',
    /** 重新读取当前数据范围的入口。 */
    refresh: 'Refresh',
    /** 补充说明字段不替代结构化业务信息。 */
    remark: 'Remark',
    /** 清理筛选或表单草稿的统一动作。 */
    reset: 'Reset',
    /** 把筛选输入应用到当前查询。 */
    search: 'Search',
    /** 表格列显隐的入口提示。 */
    showColumns: 'Show/Hide columns',
    /** 筛选区域已收起时的展开动作。 */
    showSearch: 'Show search',
    /** 日期范围下界的占位提示。 */
    startDate: 'Start date',
    /** 业务状态枚举的通用字段名称。 */
    status: 'Status',
    /** 提交当前草稿，不表示服务器已经完成持久化。 */
    submit: 'Submit',
    /** 实际操作完成后使用的通用成功反馈。 */
    success: 'Operation successful',
    /** 布尔真值与提交按钮语义分别翻译。 */
    yes: 'Yes'
  },
/** 字段配置自动生成的提示、校验和本地文件选择协议。 */
hynForm: {
    /** 异步字段加载失败时显示明确状态，不伪装成空白或其他控件。 */
    rendererLoadFailed: 'Field resources failed to load. Preserve your draft before refreshing the page.',
    /** 未配置业务占位文本时以 label 插值生成输入提示。 */
    inputPlaceholder: 'Enter {label}',
    /** 未配置业务占位文本时以 label 插值生成选择提示。 */
    selectPlaceholder: 'Select {label}',
    /** 必填校验使用 label 插值指出具体字段。 */
    required: '{label} is required',
    /** 文件只暂存在浏览器模型，尚未上传服务器。 */
    filePicker: {
      /** 打开浏览器原生文件选择器。 */
      chooseFile: 'Choose file',
      /** 拖拽区域同时提供点击选择入口。 */
      dragText: 'Drop files here, or',
      /** 允许后缀列表的分隔符按当前语言配置。 */
      fileTypeSeparator: ', ',
      /** types 占位符保留实际文件后缀列表。 */
      typeTip: 'Only {types} files are allowed.',
      /** 后缀不在字段白名单时拒绝写入模型。 */
      invalidType: 'Invalid file type. Please choose {types} files.',
      /** size 插值来自字段配置的 MB 大小上限。 */
      invalidSize: 'File size must not exceed {size} MB',
      /** 模型只接受一个 File，不静默切换成文件数组。 */
      singleFileOnly: 'Only one file can be selected'
    }
  },
/** 树形选择器搜索与父子联动状态文案。 */
hynTreeSelect: {
    /** 树本地搜索支持节点名称和编号。 */
    searchPlaceholder: 'Search node name or ID',
    /** 父子联动开关只出现在树形多选模式。 */
    linkage: 'Parent-child',
    /** 告知选中父节点将级联全部后代的影响范围。 */
    linkageEnabledTip: 'On: selecting a parent also selects all descendants',
    /** 告知父子节点独立选择，避免误判级联范围。 */
    linkageDisabledTip: 'Off: parent and child nodes can be selected independently'
  },
/** 表格、虚拟列表和树表共同使用的状态与无障碍提示。 */
table: {
    /** 节点已展开时的收起动作。 */
    collapseRow: 'Collapse',
    /** 节点已收起时的展开动作。 */
    expandRow: 'Expand',
    /** 分批展开根级节点时显示进度上下文。 */
    expandingRootLevel: 'Expanding root level',
    /** 懒加载失败与正常无子节点状态分开反馈。 */
    loadFailed: 'Load failed',
    /** 子节点正在读取时标记节点忙碌状态。 */
    loadingChildren: 'Loading child nodes',
    /** 表头选择框的无障碍名称。 */
    selectAll: 'Select all',
    /** index 是当前可见行序号，不是业务主键。 */
    selectRow: 'Select row {index}',
    /** total 与 selected 分别对应数据总数和已选主键数量。 */
    totalSelected: '{total} records, {selected} selected.'
  }
},
/** HYN 弹窗和字段共同使用的宿主无关交互文案。 */
common: {
    /** 提交配置表单和实体选择时使用同一确认语义。 */
    confirm: 'Confirm',
    /** 取消只关闭当前交互，不提交编辑草稿。 */
    cancel: 'Cancel',
    /** 非提交型弹窗的退出动作。 */
    close: 'Close',
    /** 重新读取组件当前数据源时的通用动作。 */
    refresh: 'Refresh',
    /** 未传字段占位文案时的通用选择提示。 */
    select: 'Select',
    /** 展示可切换状态时的通用交互名称。 */
    switch: 'Switch'
  },
/** 独立 Cron 字段、生成器和语义校验共享命名空间。 */
quartzCron: {
    /** 按需加载的 Cron 生成器弹窗标题。 */
    title: 'Generate Cron Expression',
    /** 原始表达式输入区的字段名称。 */
    expression: 'Cron Expression',
    /** 轻量输入模式未提供业务提示时使用。 */
    placeholder: 'Please enter a Quartz Cron expression',
    /** 区分可视化规则编辑与原始表达式区域。 */
    visualTitle: 'Visual Builder',
    /** 展示解析语义而非再次展示原始字段。 */
    summaryTitle: 'Expression Description',
    /** 标识将写回业务表单的生成结果。 */
    generatedExpression: 'Generated Result',
    /** 执行时间预览固定展示五次，需与解析器数量保持一致。 */
    nextRuns: 'Next 5 Runs',
    /** 解析不通过时不允许用户误以为表达式可提交。 */
    invalidExpression: 'Invalid Cron expression',
    /** 提醒当前表达式无法由可视化控件完整表达。 */
    rawModeTitle: 'Raw Expression Mode',
    /** 保留高级合法表达式的原文，避免可视化转换损失语义。 */
    rawModeMessage: 'The current expression contains Quartz syntax that the visual panel cannot edit safely. You can keep editing and validating it manually.',
    /** 无法计算预览与语法无效分别反馈。 */
    previewUnavailable: 'The expression passed validation, but the frontend cannot calculate upcoming run times for it.',
    /** 高频计划可能增加执行压力，允许用户在保存前判断。 */
    highFrequencyWarning: 'The next run interval is no more than 1 minute. Please confirm task duration and scheduler load.',
    /** Cron 生成器的保存、关闭和复制反馈。 */
    actions: {
      /** 把生成器草稿写回父级字段，不触发后端任务。 */
      confirm: 'Save',
      /** 放弃生成器草稿并保留父级原表达式。 */
      cancel: 'Close',
      /** 打开生成器的字段级入口，保留双语识别。 */
      generate: 'Generate',
      /** 复制当前有效表达式供其他配置使用。 */
      copy: 'Copy expression',
      /** 剪贴板写入完成后才显示成功反馈。 */
      copied: 'Expression copied',
      /** 浏览器拒绝剪贴板写入时的错误反馈。 */
      copyFailed: 'Failed to copy expression'
    },
    /** 按 Quartz 字段切分生成器面板。 */
    tabs: {
      /** 将秒字段单独呈现为页签，编辑只作用于对应表达式位置。 */
      second: 'Second',
      /** 将分钟字段单独呈现为页签，编辑只作用于对应表达式位置。 */
      minute: 'Minute',
      /** 将小时字段单独呈现为页签，编辑只作用于对应表达式位置。 */
      hour: 'Hour',
      /** 将日期字段单独呈现为页签，编辑只作用于对应表达式位置。 */
      day: 'Day',
      /** 将月份字段单独呈现为页签，编辑只作用于对应表达式位置。 */
      month: 'Month',
      /** 将年份字段单独呈现为页签，编辑只作用于对应表达式位置。 */
      year: 'Year',
      /** 日周互斥等约束存在时标记受限页签。 */
      constrained: 'Field constrained'
    },
    /** 供规则说明拼接使用的单位，与表达式数值分离。 */
    units: {
      /** 秒规则说明所用完整单位，供不同语序的语言包独立配置。 */
      second: 'second',
      /** 分钟规则说明所用完整单位，供不同语序的语言包独立配置。 */
      minute: 'minute',
      /** 小时规则说明所用完整单位，供不同语序的语言包独立配置。 */
      hour: 'hour',
      /** 紧凑秒数控件避免重复完整单位描述。 */
      secondShort: 'sec',
      /** 紧凑分钟控件使用短单位以保持行内布局。 */
      minuteShort: 'min',
      /** 小时起始值按时点展示，区别于持续时间。 */
      hourPoint: "o'clock",
      /** 月份规则说明所用完整单位，供不同语序的语言包独立配置。 */
      month: 'month',
      /** 年份规则说明所用完整单位，供不同语序的语言包独立配置。 */
      year: 'year'
    },
    /** 离散值多选浮层共用的提示和计数。 */
    picker: {
      /** 未选离散值时提示打开候选面板。 */
      placeholder: 'Select',
      /** 数量来自已选项，count 占位符必须保留。 */
      selectedCount: '{count} selected',
      /** 只清空当前字段的离散候选，不重置其他 Cron 字段。 */
      clear: 'Clear'
    },
    /** 秒、分、时、月、年共用的基础规则表达。 */
    simple: {
      /** 年份可省略，不把未指定年份误写成固定当前年。 */
      notSpecifiedYear: 'Do not specify year',
      /** unit 由当前页签传入，用于基础每单位规则。 */
      every: 'Every {unit}',
      /** 区分固定间隔规则与离散值规则。 */
      intervalLabel: 'Interval',
      /** 拼接间隔步长前缀，避免把步长解释成起始值。 */
      intervalPrefix: 'Every',
      /** unit 占位符承接当前字段的持续单位。 */
      intervalStepSuffix: '{unit}(s)',
      /** 提示间隔规则的起始位置。 */
      intervalStartPrefix: 'starting at',
      /** unit 与起始数值组合成可读说明。 */
      intervalStartSuffix: '{unit}',
      /** 提示同一字段可选择多个离散值。 */
      specific: 'Specific {unit}s',
      /** 连续范围与离散多选使用不同模式。 */
      rangeLabel: 'Range',
      /** 连续区间的下界提示。 */
      rangePrefix: 'From',
      /** 连接同一字段的区间下界与上界。 */
      rangeMiddle: 'to',
      /** 范围单位继承当前字段，不写死时间粒度。 */
      rangeSuffix: '{unit}',
      /** 提供区间控件无障碍名称的字段名。 */
      fieldNames: {
        /** 为秒数字控件提供所属字段的上下文。 */
        second: 'second',
        /** 为分钟数字控件提供所属字段的上下文。 */
        minute: 'minute',
        /** 为小时数字控件提供所属字段的上下文。 */
        hour: 'hour',
        /** 为月份数字控件提供所属字段的上下文。 */
        month: 'month',
        /** 为年份数字控件提供所属字段的上下文。 */
        year: 'year'
      },
      /** 起始值使用位置单位，不作为间隔时长。 */
      startUnits: {
        /** 秒起始位置的显示单位，不用于描述持续时间。 */
        second: 'sec',
        /** 分钟起始位置的显示单位，不用于描述持续时间。 */
        minute: 'min',
        /** 小时起始位置的显示单位，不用于描述持续时间。 */
        hour: "o'clock",
        /** 月份起始位置的显示单位，不用于描述持续时间。 */
        month: 'month',
        /** 年份起始位置的显示单位，不用于描述持续时间。 */
        year: 'year'
      },
      /** 步长使用持续单位，与起始位置单位区分。 */
      intervalUnits: {
        /** 秒间隔步长的显示单位，与起始位置分别本地化。 */
        second: 'sec',
        /** 分钟间隔步长的显示单位，与起始位置分别本地化。 */
        minute: 'min',
        /** 小时间隔步长的显示单位，与起始位置分别本地化。 */
        hour: 'hour',
        /** 月份间隔步长的显示单位，与起始位置分别本地化。 */
        month: 'month',
        /** 年份间隔步长的显示单位，与起始位置分别本地化。 */
        year: 'year'
      },
      /** 各字段的全值模式单独本地化，避免硬拼中文语序。 */
      everyTitles: {
        /** 秒全值模式的完整规则描述，避免跨语言词序拼接。 */
        second: 'Every second',
        /** 分钟全值模式的完整规则描述，避免跨语言词序拼接。 */
        minute: 'Every minute',
        /** 小时全值模式的完整规则描述，避免跨语言词序拼接。 */
        hour: 'Every hour',
        /** 月份全值模式的完整规则描述，避免跨语言词序拼接。 */
        month: 'Every month',
        /** 年份全值模式的完整规则描述，避免跨语言词序拼接。 */
        year: 'Every year'
      },
      /** 基础规则中数字输入的无障碍标签。 */
      controls: {
        /** 标记间隔步长输入，不和起始值输入混淆。 */
        interval: 'Step',
        /** unit 占位符指出当前字段的间隔起点。 */
        intervalStart: 'Start {unit}',
        /** unit 占位符指出连续范围下界所属字段。 */
        rangeStart: 'Start {unit}',
        /** unit 占位符指出连续范围上界所属字段。 */
        rangeEnd: 'End {unit}'
      }
    },
    /** 日字段与周字段的互斥规则统一由日期面板表达。 */
    day: {
      /** 按月日期规则与星期规则分组展示。 */
      dateGroup: 'Date rules',
      /** 星期规则使用 Quartz 编号，避免与 JavaScript 星期混用。 */
      weekGroup: 'Weekday rules',
      /** Quartz 固定以一表示周日，此约定来自表达式协议。 */
      weekHint: 'Quartz weekday numbers: 1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday, 7=Saturday.',
      /** 日模式每一天执行，周字段必须保持问号。 */
      every: 'Every day',
      /** 日字段使用问号时交由周字段决定执行日期。 */
      notSpecified: 'Do not specify day-of-month; run on every weekday field value',
      /** 按月内日期步进，不等同跨月的固定时长。 */
      dayIntervalLabel: 'Day interval',
      /** 日期步进说明中步长的引导词。 */
      dayIntervalPrefix: 'Every',
      /** 标记步长单位为天，避免与星期序号混淆。 */
      dayIntervalStepSuffix: 'day(s)',
      /** 提示月内日期步进的起点。 */
      dayIntervalStartPrefix: 'starting on day',
      /** 起点属于月内日期，不是月份编号。 */
      dayIntervalStartSuffix: '',
      /** 月内日期允许离散多选。 */
      specificDay: 'Specific days',
      /** day 占位符来自合法月内日期候选。 */
      dayLabel: 'Day {day}',
      /** 连续月内日期范围的起始说明。 */
      dayRangePrefix: 'Day from',
      /** 连接月内日期范围两个端点。 */
      dayRangeMiddle: 'to',
      /** 说明范围端点属于日期字段。 */
      dayRangeSuffix: '',
      /** 对应 Quartz L 语义，不固化为某个月的三十一日。 */
      lastDay: 'Last day of the month',
      /** 对应 LW 语义，不等同最后一个星期五。 */
      lastWorkDay: 'Last weekday of the month',
      /** 对应指定日期附近的 W 工作日规则。 */
      nearestWorkDayLabel: 'Nearest weekday',
      /** 把月内目标日期与最近工作日语义连接。 */
      nearestWorkDayPrefix: 'Nearest weekday to day',
      /** 提示实际执行日由最近工作日规则确定。 */
      nearestWorkDaySuffix: 'of the month',
      /** 按 Quartz 星期编号选择多个执行日。 */
      specificWeek: 'Specific weekdays',
      /** 编号步进属于高级星期模式，避免误解为每隔若干周。 */
      weekIntervalLabel: 'Weekday number interval (advanced)',
      /** 星期编号步进的起始值引导。 */
      weekIntervalPrefix: 'Start from',
      /** 区分起始星期编号与步进数值。 */
      weekIntervalMiddle: 'and steps every',
      /** 强调步进的是编号而非连续自然周。 */
      weekIntervalSuffix: 'weekday value(s)',
      /** 星期连续范围的下界说明。 */
      weekRangePrefix: 'Weekday from',
      /** 连接范围上下界的 Quartz 星期编号。 */
      weekRangeMiddle: 'to',
      /** 对应某星期在月内最后一次出现的 L 规则。 */
      lastSpecificWeekLabel: 'Last weekday in month',
      /** 提示所选星期在当月的最后一次出现。 */
      lastSpecificWeekPrefix: 'Last',
      /** 对应 Quartz 井号规则，选择月内第 N 个星期。 */
      nthWeekLabel: 'Nth weekday in month',
      /** 引导月内星期出现次数的序号。 */
      nthWeekPrefix: 'The',
      /** 连接出现次数与目标星期。 */
      nthWeekMiddle: 'weekday occurrence of',
      /** 日期面板输入控件的无障碍名称。 */
      controls: {
        /** 日期步长输入与起始日期输入分别标注。 */
        interval: 'Step',
        /** 日期步进的月内起点。 */
        startDay: 'Start day',
        /** 最近工作日规则的目标月内日期。 */
        nearestDay: 'Day',
        /** 星期编号步进的起点。 */
        startWeek: 'Start weekday',
        /** 选择目标 Quartz 星期编号。 */
        weekday: 'Weekday',
        /** 月内出现次序输入，区别于星期编号。 */
        nth: 'Occurrence'
      },
      /** 日期规则中各数字输入的单位。 */
      units: {
        /** 日期步长使用天数单位。 */
        day: 'day(s)',
        /** 月内目标日期的位置单位。 */
        dayOfMonth: 'day',
        /** 明确高级步进按星期编号计算。 */
        weekIndex: 'weekday value(s)',
        /** 用于月内第 N 次出现的位置说明。 */
        ordinal: ''
      }
    },
    /** 月份离散选择候选的本地化标签。 */
    month: {
      /** month 占位符直接对应 Cron 月份一至十二。 */
      monthLabel: 'Month {month}'
    },
    /** 可选年份字段的候选显示文案。 */
    year: {
      /** year 占位符显示实际年份，不能替换为偏移量。 */
      yearLabel: '{year}'
    },
    /** 候选标签保留 Quartz 原始星期编号供用户核对。 */
    week: {
      /** Quartz 一对应周日，不能使用 JavaScript 的零。 */
      sunday: '1 - Sunday',
      /** Quartz 二对应周一，避免采用 ISO 周一编号。 */
      monday: '2 - Monday',
      /** 标签中的三对应 Quartz 周二值。 */
      tuesday: '3 - Tuesday',
      /** 标签中的四对应 Quartz 周三值。 */
      wednesday: '4 - Wednesday',
      /** 标签中的五对应 Quartz 周四值。 */
      thursday: '5 - Thursday',
      /** 标签中的六对应 Quartz 周五值。 */
      friday: '6 - Friday',
      /** 标签中的七对应 Quartz 周六值。 */
      saturday: '7 - Saturday'
    },
    /** 同一表达式同时展示中英文解释的语言标记。 */
    summary: {
      /** 标记 cronstrue 生成的中文解释，避免被误当成另一表达式。 */
      zh: '中文: ',
      /** 标记同一表达式的英文解释。 */
      en: 'English: '
    },
    /** 纯解析函数和生成器共享语义校验反馈。 */
    validation: {
      /** Quartz 只接受六段或七段，区别于五段 Unix Cron。 */
      fieldCount: 'Quartz Cron requires 6 or 7 fields',
      /** 可视化不支持与表达式无效分开说明。 */
      unsupportedVisualSyntax: 'The expression contains Quartz syntax that the visual panel does not support yet',
      /** 合法高级日周表达式保留原文编辑，避免自动重写。 */
      advancedDayWeek: 'The expression is valid, but the day/week fields use advanced mode. Keep the original expression in the form input.',
      /** 空表达式在最终提交前明确拒绝。 */
      required: 'Cron expression is required',
      /** 格式或字段范围不合法时使用的通用反馈。 */
      invalid: 'Invalid Cron expression',
      /** 问号只允许出现在日或周字段。 */
      questionMarkAllowed: 'Only the day-of-month and day-of-week fields support the ? placeholder in Quartz Cron',
      /** 日与周必须且只能有一个问号，遵循当前 Quartz 校验约束。 */
      dayWeekQuestionMark: 'Exactly one of the day-of-month and day-of-week fields must use ? in Quartz Cron',
      /** L-N 的偏移限定一至三十一，避免越界日期规则。 */
      lastDayOffsetRange: 'N in L-N syntax must be between 1 and 31',
      /** 格式有效但预览能力不覆盖 L-N 时单独说明。 */
      lastDayOffsetPreviewUnsupported: 'The expression contains L-N syntax. Format validation passed, but the frontend cannot calculate upcoming run times.',
      /** 保留解析器 message 以便定位表达式故障。 */
      parseFailed: 'Failed to parse Cron expression: {message}',
      /** 解析器未提供详细原因时仍给出可执行的字段检查建议。 */
      parseFailedGeneric: 'Failed to parse Cron expression. Check the Quartz field format.'
    }
  }
};
