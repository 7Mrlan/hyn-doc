export default {
  aria: {
    changeLanguage: '切换语言',
    closeSearch: '关闭搜索',
    currentDocumentToc: '当前文档目录',
    pageLoading: '页面加载中',
    searchAppsMenus: '搜索应用、系统、菜单',
    workspace: '统一认证工作台',
    workspaceMetrics: '工作台指标'
  },
  auth: {
    accountHeroAria: '统一身份认证介绍',
    accountCardAria: '域账户登录',
    heroKicker: 'Unified Identity Platform',
    heroTitle: '恒翼能全域统一身份认证中心',
    heroSubtitle: '安全、高效、便捷的一站式身份认证与访问平台',
    metricOAuthTitle: 'OAuth2.0',
    metricOAuth: '标准授权',
    metricSSOTitle: 'SSO',
    metricSSO: '统一入口',
    metricSecurityTitle: 'Security',
    metricSecurity: '可信认证',
    accountPanelKicker: '企业身份认证',
    accountPanelTitle: '域账户登录',
    accountPanelDescription: '使用企业域账号进入统一身份认证平台',
    accountLabel: '账号',
    accountPlaceholder: '请输入工号/邮箱/手机号',
    passwordLabel: '密码',
    passwordPlaceholder: '请输入密码',
    captchaLabel: '验证码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码?',
    passwordGuide: {
      title: '密码重置指引',
      kicker: 'ITAD 自助服务',
      steps: {
        openWorkbench: {
          title: '打开工作台',
          description: '打开钉钉，点击左侧「工作台」。'
        },
        findItad: {
          title: '找到 ITAD 自助服务',
          description: '在右侧应用列表中找到「ITAD 自助服务」，找不到可在顶部搜索框输入「ITAD」搜索。'
        },
        selectReset: {
          title: '选择重置密码',
          description: '进入应用后选择「重置密码」，即可设置新密码。'
        },
        submitEffective: {
          title: '提交后即时生效',
          description: '提交后密码立即生效；若重置失败，可联系 IT 服务台协助处理。'
        }
      },
      help: '如需帮助，请联系您的 IT 服务台或管理员。',
      imageAlt: '钉钉 ITAD 自助服务重置密码入口截图'
    },
    login: '登录',
    otherLogin: '其他登录方式',
    dingtalkLogin: '钉钉扫码登录',
    agreementPrefix: '登录即代表同意',
    userAgreement: '《用户协议》',
    privacyPolicy: '《隐私政策》',
    agreementJoiner: '和',
    requiredWarning: '请先完成必填项',
    scan: {
      aria: '钉钉扫码登录',
      kicker: 'Scan Login',
      title: '钉钉扫码登录',
      subtitle: '使用钉钉完成身份授权，系统将自动校验账号绑定状态',
      generatingTitle: '正在生成安全二维码',
      generatingTip: '请稍候，完成后使用钉钉扫码',
      authorizingTitle: '正在授权登录',
      authorizingTip: '已获取授权码，正在校验账号绑定',
      errorTitle: '二维码加载失败',
      errorTip: '请检查扫码配置接口、SDK 地址和控制台错误信息',
      reload: '重新加载二维码',
      backAccount: '返回域账户登录',
      registerAccount: '注册账号'
    },
    binding: {
      artAria: '绑定安全插画',
      contentAria: '用户绑定',
      artKicker: 'Account Binding',
      artTitle: '确认钉钉身份，绑定企业域账号',
      artSubtitle: '绑定成功后，系统将使用该域账号完成后续统一认证。',
      panelKicker: 'DingTalk Identity',
      panelTitle: '用户绑定',
      panelDescription: '请使用企业域账号确认绑定关系。',
      pending: '待绑定',
      domainAccountLabel: '域账号',
      bind: '绑定',
      successTip: '绑定成功后，系统将使用该域账号为您自动登录',
      validationWarning: '请先填写域账号和密码',
      metaText: '{label}：{value}',
      email: '邮箱',
      dingTalkUserId: '钉钉用户ID',
      openId: 'OpenID',
      department: '部门',
      title: '岗位'
    },
    success: {
      artAria: '绑定成功插画',
      contentAria: '绑定成功',
      artKicker: 'Binding Complete',
      artTitle: '统一认证关系已建立',
      artSubtitle: '后续可通过钉钉身份完成更轻量的授权登录。',
      title: '绑定成功',
      redirecting: '将为您自动跳转系统页面',
      backAccount: '返回账号登录'
    },
    authorization: {
      aria: '授权登录账号确认',
      kicker: 'Authorization',
      title: '选择要登录的账号',
      subtitle: '您正在使用当前已登录账号完成统一身份认证授权。',
      continueWithAccount: '以此账号授权登录',
      authorizing: '正在跳转授权...',
      useOtherAccount: '使用其他账号',
      missingRedirectUrl: '缺少授权跳转地址，无法继续授权登录',
      unknownUser: '当前用户',
      accountLabel: '账号',
      employeeNoLabel: '工号',
      nicknameLabel: '姓名',
      emailLabel: '邮箱',
      mobileLabel: '手机',
      privacyNote: '确认后仅跳转到应用指定地址，本页不会向地址追加用户资料或 token。'
    },
    flow: {
      preloading: '正在加载...',
      missingBoundToken: '钉钉账号已绑定，但后端未返回系统登录 token',
      missingScanIdentity: '缺少钉钉扫码身份，请重新扫码',
      bindingUsernameRequired: '请输入工号/邮箱/手机号',
      bindingPasswordRequired: '请输入密码'
    }
  },
  common: {
    action: '操作',
    add: '新增',
    back: '返回',
    clear: '清空',
    cancel: '取消',
    close: '关闭',
    confirm: '确定',
    delete: '删除',
    deleteSuccess: '删除成功',
    detail: '详情',
    edit: '编辑',
    endDate: '结束日期',
    export: '导出',
    hideSearch: '隐藏搜索',
    import: '导入',
    index: '序号',
    loading: '加载中...',
    loadingMore: '加载更多...',
    more: '更多',
    noData: '暂无数据',
    no: '否',
    refresh: '刷新',
    remark: '备注',
    reset: '重置',
    search: '搜索',
    showColumns: '显示/隐藏列',
    showSearch: '显示搜索',
    startDate: '开始日期',
    status: '状态',
    submit: '提交',
    success: '操作成功',
    yes: '是'
  },
  hynForm: {
    inputPlaceholder: '请输入{label}',
    selectPlaceholder: '请选择{label}',
    required: '{label}不能为空',
    filePicker: {
      chooseFile: '点击选择',
      dragText: '将文件拖到此处，或',
      fileTypeSeparator: '、',
      typeTip: '仅允许选择 {types} 格式文件。',
      invalidType: '文件格式不正确，请选择 {types} 格式文件',
      invalidSize: '文件大小不能超过 {size} MB',
      singleFileOnly: '只能选择一个文件'
    }
  },
  hynTreeSelect: {
    searchPlaceholder: '搜索节点名称或编号',
    linkage: '父子联动',
    linkageEnabledTip: '已开启：选择父节点会同步选择全部子节点',
    linkageDisabledTip: '已关闭：父子节点可独立选择'
  },
  generator: {
    addTitle: '添加{name}',
    collapseAll: '收起全部',
    deleteConfirm: '是否确认删除{name}编号为“{id}”的数据项？',
    deleteSuccess: '删除成功',
    dictOptionPlaceholder: '请选择字典生成',
    disable: '停用',
    emptyData: '暂无{name}数据',
    enable: '启用',
    endDate: '结束日期',
    expandOne: '展开一级',
    filterConditions: '筛选条件',
    inputPlaceholder: '请输入{label}',
    editTitle: '修改{name}',
    listTitle: '{name}列表',
    required: '{label}不能为空',
    selectPlaceholder: '请选择{label}',
    sortSuccess: '排序更新成功',
    startDate: '开始日期',
    statusConfirm: '确认要“{action}”吗？',
    statusSuccess: '{action}成功',
    topNode: '顶级节点'
  },
  language: {
    english: 'English',
    simplifiedChinese: '简体中文',
    unsupportedCommand: '不支持的语言切换命令：{command}'
  },
  modal: {
    systemTip: '系统提示'
  },
  brand: {
    logoAlt: '恒翼能',
    title: 'SSO统一认证'
  },
  settings: {
    navTitle: '菜单导航设置',
    navLeft: '左侧菜单',
    navMix: '混合菜单',
    navTop: '顶部菜单',
    themeTitle: '主题风格设置',
    checkIcon: '图标: check',
    themeColor: '主题颜色',
    darkMode: '深色模式',
    pageRadius: '页面圆角',
    layoutTitle: '系统布局配置',
    tagsView: '开启 Tags-Views',
    tagsViewPersist: '持久化标签页',
    tagsIcon: '显示页签图标',
    fixedHeader: '固定 Header',
    sidebarLogo: '显示 Logo',
    saveConfig: '保存配置',
    resetConfig: '重置配置',
    saving: '正在保存到本地，请稍候...',
    resetting: '正在清除设置缓存并刷新，请稍候...'
  },
  iconSelect: {
    choose: '点击选择图标',
    search: '搜索图标',
    customHint: '也可以直接输入 Iconify 图标名',
    customPlaceholder: '例如：mdi:account-circle-outline',
    use: '使用'
  },
  sizeSelect: {
    large: '较大',
    default: '默认',
    small: '稍小'
  },
  treePanel: {
    placeholder: '请输入名称',
    disabled: '停用'
  },
  errorPage: {
    forbiddenCode: '401错误!',
    forbiddenTitle: '您没有访问权限！',
    forbiddenDescription: '对不起，您没有访问权限，请不要进行非法操作！您可以返回主页面',
    backHomeShort: '回首页',
    notFoundCode: '404错误!',
    notFoundTitle: '找不到网页！',
    notFoundDescription:
      '对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。',
    backHome: '返回首页',
    backendEyebrow: '系统消息',
    backendTitle: '错误提示',
    backendMessageAria: '后端错误信息'
  },
  navbar: {
    admin: '管理员',
    workspaceRole: 'Workspace'
  },
  request: {
    duplicateSubmit: '数据正在处理，请勿重复提交',
    downloadError: '下载文件出现错误，请联系管理员！',
    downloadLoading: '正在下载数据，请稍候',
    networkError: '后端接口连接异常',
    timeout: '系统接口请求超时',
    statusError: '系统接口 {status} 异常',
    unauthorized: '无效的会话，或者会话已过期，请重新登录。',
    reloginConfirm: '登录状态已过期，您可以继续留在该页面，或者重新登录',
    relogin: '重新登录',
    contractError: 'API 响应格式不符合 code/msg/data 契约：{reason}; {context}; response={response}',
    contractObject: '响应必须是对象',
    contractMissingFields: '缺少字段 {fields}',
    contractExtraFields: '存在额外字段 {fields}',
    contractCodeType: 'code 应为 number，实际为 {actual}',
    contractMsgType: 'msg 应为 string，实际为 {actual}',
    unknownError: '系统未知错误，请反馈给管理员'
  },
  route: {
    home: '首页',
    profile: '个人中心',
    error: '错误提示',
    applicationSwitch: '应用快捷切换',
    assignRole: '分配角色',
    assignUser: '分配用户',
    dictData: '字典数据',
    editGeneratorConfig: '修改生成配置'
  },
  register: {
    brandPill: 'YZL SSO Workspace',
    brandTitle: 'SSO统一认证平台',
    brandDescLine1: '面向企业内部应用的统一认证入口，集中承载账号登录、动态权限、组织用户与安全审计能力。',
    brandDescLine2: '以 SSO 为核心连接业务系统，让用户一次认证后稳定进入授权工作台。',
    highlightTech: '技术栈全面升级',
    highlightMenu: '动态菜单',
    highlightLayout: '多主题布局',
    highlightTheme: '深浅色主题',
    metricPermissionLabel: '细粒度权限管理',
    metricPermissionValue: '动态权限控制',
    metricStackLabel: '主流技术栈',
    metricStackValue: '全栈技术集成',
    metricUiLabel: 'UI样式',
    metricUiValue: '卡片式',
    eyebrow: 'Workspace Register',
    subtitle: '创建新的业务工作台账号，接入当前系统权限与登录体系。',
    registerTip: '注册后将返回登录页继续完成认证',
    copyright: 'Copyright © 2018-{year} YZL All Rights Reserved.'
  },
  search: {
    history: '搜索历史',
    hotApps: '热门应用',
    recommendationCount: '{count} 个推荐',
    foundCount: '找到 {count} 个结果',
    emptyText: '没有找到“{keyword}”',
    emptyTip: '换个应用名、系统名或菜单路径试试',
    app: '应用',
    menu: '菜单',
    shortcutSwitch: '切换',
    shortcutOpen: 'Ctrl K',
    shortcutEnterKey: 'Enter',
    shortcutEscKey: 'Esc',
    shortcutSelect: '选择',
    shortcutClose: '关闭',
    triggerPlaceholder: '搜索应用、系统、菜单...',
    applicationLoadFailed: '应用搜索数据加载失败：{message}',
    unnamedApp: '未命名应用',
    applicationCenter: '应用中心',
    authorizationPending: '授权入口接口待配置，已记录本次访问'
  },
  upload: {
    pickFile: '选取文件',
    uploadPrefix: '请上传',
    uploadSizePrefix: '大小不超过',
    uploadTypePrefix: '格式为',
    uploadSuffix: '的文件',
    deleteFile: '删除',
    invalidType: '文件格式不正确，请上传 {types} 格式文件！',
    invalidName: '文件名不正确，不能包含英文逗号！',
    invalidSize: '上传文件大小不能超过 {size} MB！',
    uploading: '正在上传文件，请稍候...',
    limitExceeded: '上传文件数量不能超过 {limit} 个！',
    failed: '上传文件失败',
    responseError: '上传文件响应异常：{message}',
    unknownResponseError: '未知响应解析错误',
    imageInsertFailed: '图片插入失败',
    imageUploadFailed: '图片上传失败',
    videoUploadFailed: '视频上传失败',
    preview: '预览',
    imageInvalidType: '文件格式不正确，请上传 {types} 图片格式文件！',
    imageInvalidSize: '上传头像图片大小不能超过 {size} MB！',
    imageUploading: '正在上传图片，请稍候...',
    imageResponseError: '上传图片响应异常：{message}',
    imageFailed: '上传图片失败',
    videoInvalidType: '视频格式错误，请上传 {types} 格式！',
    videoInvalidSize: '上传视频大小不能超过 {size} MB！',
    videoUploading: '正在上传视频，请稍候...',
    editorPlaceholder: '请输入内容'
  },
  table: {
    collapseRow: '收起',
    expandRow: '展开',
    expandingRootLevel: '正在展开一级',
    loadFailed: '加载失败',
    loadingChildren: '正在加载子节点',
    selectAll: '选择全部',
    selectRow: '选择第 {index} 行',
    totalSelected: '共 {total} 条记录，已选 {selected} 项。'
  },
  toolGen: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '代码生成',
    listTitle: '数据表列表',
    listSummary: '共 {total} 条记录，支持导入表结构、同步数据库和代码预览生成。',
    emptyText: '暂无数据表',
    previewTitle: '代码预览',
    copy: '复制',
    copySuccess: '复制成功',
    selectGenerateData: '请选择要生成的数据',
    customPathSuccess: '成功生成到自定义路径：{path}',
    selectSyncData: '请选择要同步的数据',
    syncConfirm: '确认要强制同步"{name}"表结构吗？',
    syncSuccess: '同步成功',
    deleteConfirm: '是否确认删除表编号为"{ids}"的数据项？',
    importTitle: '导入表',
    importEmptyText: '暂无可导入表',
    selectImportTable: '请选择要导入的表',
    restoreDefaultPath: '恢复默认路径',
    validationFailed: '表单校验未通过，请重新检查提交内容',
    valuePair: '{name}：{comment}',
    action: {
      generate: '生成',
      preview: '预览',
      sync: '同步',
      generateCode: '生成代码'
    },
    tab: {
      basicInfo: '基本信息',
      columnInfo: '字段信息',
      genInfo: '生成信息'
    },
    section: {
      otherInfo: '其他信息',
      relationInfo: '关联信息'
    },
    field: {
      tableName: '表名称',
      tableComment: '表描述',
      createTime: '创建时间',
      updateTime: '更新时间',
      entity: '实体',
      className: '实体类名称',
      functionAuthor: '作者',
      columnName: '字段列名',
      columnComment: '字段描述',
      columnType: '物理类型',
      netType: '.Net类型',
      netField: '.Net属性',
      isInsert: '插入',
      isEdit: '编辑',
      isList: '列表',
      isQuery: '查询',
      queryType: '查询方式',
      isRequired: '必填',
      htmlType: '显示类型',
      dictType: '字典类型',
      tplCategory: '生成模板',
      packageName: '生成包路径',
      moduleName: '生成模块名',
      businessName: '生成业务名',
      functionName: '生成功能名',
      parentMenuId: '上级菜单',
      genType: '生成代码方式',
      genPath: '自定义路径',
      treeCode: '树编码字段',
      treeParentCode: '树父编码字段',
      treeName: '树名称字段',
      subTableName: '关联子表的表名',
      subTableFkName: '子表关联的外键名'
    },
    placeholder: {
      tableName: '请输入表名称',
      tableComment: '请输入表描述',
      className: '请输入实体类名称',
      functionAuthor: '请输入作者',
      genericInput: '请输入',
      select: '请选择',
      parentMenuId: '请选择系统菜单'
    },
    rule: {
      tableName: '请输入表名称',
      tableComment: '请输入表描述',
      className: '请输入实体类名称',
      functionAuthor: '请输入作者',
      tplCategory: '请选择生成模板',
      packageName: '请输入生成包路径',
      moduleName: '请输入生成模块名',
      businessName: '请输入生成业务名',
      functionName: '请输入生成功能名'
    },
    templateCategory: {
      crud: '单表（增删改查）',
      tree: '树表（增删改查）',
      sub: '主子表（增删改查）'
    },
    genType: {
      zip: 'zip压缩包',
      customPath: '自定义路径'
    },
    netType: {
      long: 'long',
      string: 'string',
      int: 'int',
      double: 'double',
      decimal: 'decimal',
      dateTime: 'DateTime',
      bool: 'bool'
    },
    tooltip: {
      packageName: '生成在哪个包下，例如 RuoYi.System',
      moduleName: '可理解为子系统名，例如 system',
      businessName: '可理解为功能英文名，例如 user',
      functionName: '用作类描述，例如 用户',
      parentMenuId: '分配到指定菜单下，例如 系统管理',
      genType: '默认为 zip 压缩包下载，也可以自定义生成路径',
      genPath: '填写磁盘绝对路径，若不填写，则生成到当前 Web 项目下',
      treeCode: '树显示的编码字段名，如：dept_id',
      treeParentCode: '树显示的父编码字段名，如：parent_id',
      treeName: '树节点的显示名称字段名，如：dept_name',
      subTableName: '关联子表的表名，如：sys_user',
      subTableFkName: '子表关联的外键名，如：user_id'
    },
    htmlType: {
      input: '文本框',
      textarea: '文本域',
      select: '下拉框',
      radio: '单选框',
      checkbox: '复选框',
      datetime: '日期控件',
      imageUpload: '图片上传',
      fileUpload: '文件上传',
      editor: '富文本控件'
    }
  },
  workspace: {
    recent: '最近访问',
    collapse: '收起',
    favorite: '收藏应用',
    done: '完成',
    edit: '编辑',
    allApps: '全部应用',
    allCategory: '全部',
    uncategorized: '未分类',
    unnamedApp: '未命名应用',
    noVisitRecord: '暂无访问记录',
    emptyRecentTitle: '暂无最近访问',
    emptyRecentDescription: '打开任意应用后，这里会自动沉淀你的高频入口。',
    emptyFavoriteTitle: '暂无收藏应用',
    emptyFavoriteDescription: '把常用系统点亮收藏，工作台会保持清爽但触手可及。',
    emptySearchTitle: '没有匹配的应用',
    emptySearchDescription: '可以切换分类，或等待后端返回可访问应用列表。',
    applicationLoadFailed: '首页应用数据加载失败：{message}',
    launchFailed: '进入应用失败：{message}',
    authorizeUrlMissing: '应用 {name} 未配置 authorizeUrl，无法跳转',
    applicationTotal: '应用总数',
    currentAccessible: '当前可访问',
    online: '已上线',
    fromApplicationList: '来自应用清单',
    todayVisits: '今日访问',
    countedByVisitRecords: '按访问记录统计',
    pendingReview: '待审核',
    pendingApiStatus: '接口待补充状态'
  },
  applicationCenter: {
    aria: '应用中心',
    title: '应用中心',
    categoryFilterAria: '应用分类筛选',
    emptyTitle: '没有匹配的应用',
    emptyDescription: '可以切换分类，或等待后端返回可访问应用列表。',
    detailTitle: '应用详情',
    closeDetail: '关闭应用详情',
    enter: '进入应用',
    category: '分类',
    permission: '权限',
    lastUsed: '最近使用',
    authorized: '已授权',
    unavailable: '不可用',
    favorite: '收藏 {name}',
    unfavorite: '取消收藏 {name}',
    loadFailed: '应用中心数据加载失败：{message}',
    favoriteUpdateFailed: '收藏状态更新失败：{message}',
    launchFailed: '进入应用失败：{message}',
    selectApplicationRequired: '未选择要进入的应用'
  },
  applicationSwitch: {
    aria: '应用快捷切换',
    searchAria: '搜索应用',
    searchPlaceholder: '搜索应用...',
    clearSearch: '清空搜索',
    more: '更多',
    backHome: '回到首页',
    openUserMenu: '打开用户菜单',
    categoryMoreAria: '查看更多应用分类',
    recentRegion: '最近访问应用',
    allRegion: '全部应用',
    loadingStatus: '加载中',
    resultCount: '{count} 个应用',
    errorRetry: '重试',
    launchingGeneric: '应用',
    launchingApp: '正在进入 {name}',
    launchingDescription: '正在完成访问记录和授权跳转，请稍候。',
    navigatingHome: '正在回到首页',
    navigatingHomeDescription: '正在退出快捷切换页，返回项目首页。',
    loggingOut: '正在退出登录',
    loggingOutDescription: '正在清理当前会话并返回登录页。',
    emptyRecentDescription: '访问应用后会在这里显示最近使用入口。',
    loadFailed: '应用快捷切换数据加载失败：{message}',
    launchFailed: '进入应用失败：{message}'
  },
  ssoApplication: {
    title: 'OAuth 应用管理',
    create: '创建应用',
    searchAppNamePlaceholder: '请输入应用名称',
    searchAppKeyPlaceholder: '请输入 AppKey',
    selectCategoryPlaceholder: '请选择应用分类',
    selectGrantTypePlaceholder: '请选择授权方式',
    selectStatusPlaceholder: '请选择状态',
    emptyText: '暂无 OAuth 应用',
    generatedAfterCreate: '系统生成后展示',
    copySecret: '复制应用密钥',
    status: {
      online: '已上线',
      reviewing: '审核中',
      offline: '已下线',
      draft: '草稿'
    },
    field: {
      appName: '应用名称',
      appKey: 'AppKey',
      appId: 'AppId',
      appSecret: '应用密钥',
      appCategory: '应用分类',
      grantType: '授权方式',
      status: '状态',
      callbackUrl: '回调地址',
      resignationCallbackUrl: '离职回调地址',
      appIcon: '应用图标',
      appDescription: '应用描述',
      remark: '备注',
      authSources: '授权来源',
      appInfo: '应用信息',
      createTime: '创建时间'
    },
    placeholder: {
      appName: '请输入应用名称',
      callbackUrl: '请输入授权回调地址',
      resignationCallbackUrl: '请输入离职回调地址',
      appDescription: '请输入应用描述',
      remark: '请输入备注'
    },
    rule: {
      appName: '应用名称不能为空',
      grantType: '授权方式不能为空',
      status: '状态不能为空',
      callbackUrl: '回调地址不能为空'
    },
    dialog: {
      create: '创建 OAuth 应用',
      edit: '编辑 OAuth 应用'
    },
    action: {
      edit: '编辑',
      delete: '删除'
    },
    detailInvalid: '应用详情结构无效',
    copySuccess: '复制成功',
    copyFailed: '复制失败：{message}',
    deleteConfirm: '是否确认删除应用编号为 "{ids}" 的数据项？',
    deleteSuccess: '删除成功'
  },
  systemUser: {
    deptTreeTitle: '部门结构',
    deptTreePlaceholder: '请输入部门名称',
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '用户数据集',
    listTitle: '用户列表',
    listSummary: '共 {total} 条记录，支持部门筛选、状态切换、导入导出和角色分配。',
    emptyText: '暂无用户数据',
    downloadTemplate: '下载模板',
    importData: '导入数据',
    exportData: '导出数据',
    importTitle: '用户导入',
    importDropText: '将文件拖到此处，或',
    importClickUpload: '点击上传',
    importUpdateExisting: '是否更新已经存在的用户数据',
    importFileTip: '仅允许导入 xls、xlsx 格式文件。',
    importResultTitle: '导入结果',
    resetPasswordPrompt: '请输入“{name}”的新密码',
    resetPasswordTitle: '提示',
    resetPasswordSuccess: '修改成功，新密码是：{password}',
    protectedDeleteWarning: '超级管理员账号不允许删除',
    protectedDisableWarning: '超级管理员账号不允许停用',
    protectedAssignRoleWarning: '超级管理员账号不允许分配角色',
    protectedResetPasswordWarning: '超级管理员账号不允许重置密码',
    protectedEditWarning: '超级管理员账号不允许修改',
    selectAssignRoleUser: '请选择要分配角色的用户',
    selectEditUser: '请选择要修改的用户',
    deleteConfirm: '是否确认删除用户编号为“{ids}”的数据项？',
    statusConfirm: '确认要“{action}”“{name}”用户吗？',
    statusSuccess: '{action}成功',
    enable: '启用',
    disable: '停用',
    userType: {
      system: '系统用户',
      domain: '域账号'
    },
    dialog: {
      create: '新增用户',
      edit: '修改用户'
    },
    field: {
      userId: '用户编号',
      userName: '工号',
      nickName: '姓名',
      deptName: '部门',
      dept: '归属部门',
      phonenumber: '手机号码',
      email: '邮箱',
      loginAccount: '登录账号',
      userType: '用户类型',
      status: '状态',
      userStatus: '用户状态',
      createTime: '创建时间',
      updateTime: '更新时间',
      loginIp: '最后登录IP',
      loginDate: '最后登录时间',
      remark: '备注',
      password: '用户密码',
      sex: '用户性别',
      post: '岗位',
      role: '角色'
    },
    placeholder: {
      userName: '请输入工号',
      nickName: '请输入姓名',
      phonenumber: '请输入手机号码',
      status: '用户状态',
      userType: '请选择用户类型',
      dept: '请选择归属部门',
      email: '请输入邮箱',
      password: '请输入用户密码',
      sex: '请选择',
      post: '请选择岗位',
      role: '请选择角色',
      remark: '请输入内容'
    },
    rule: {
      userNameRequired: '工号不能为空',
      userNameLength: '工号长度必须介于 2 和 20 之间',
      nickNameRequired: '姓名不能为空',
      passwordRequired: '用户密码不能为空',
      passwordLength: '用户密码长度必须介于 5 和 20 之间',
      passwordLengthShort: '长度在 6 到 20 个字符',
      illegalCharacters: '不能包含非法字符：小于号、大于号、双引号、单引号、反斜杠和竖线',
      emailRequired: '邮箱地址不能为空',
      emailInvalid: '请输入正确的邮箱地址',
      phoneRequired: '手机号码不能为空',
      phoneInvalid: '请输入正确的手机号码',
      roleRequired: '用户角色不能为空'
    },
    action: {
      resetPassword: '重置密码',
      assignRole: '分配角色'
    },
    authRole: {
      basicInfo: '基本信息',
      roleInfo: '角色信息',
      selectedSummary: '已选角色（{total}）',
      noSelectedRoles: '暂未选择角色',
      showMoreSelected: '展示更多',
      collapseSelected: '收起',
      emptyRoles: '暂无角色数据',
      grantSuccess: '授权成功',
      index: '序号',
      roleId: '角色编号',
      roleName: '角色名称',
      roleKey: '权限字符'
    },
    detail: {
      title: '用户信息详情'
    }
  },
  systemPost: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '岗位数据集',
    listTitle: '岗位列表',
    listSummary: '共 {total} 条记录，支持岗位维护和导出。',
    emptyText: '暂无岗位数据',
    deleteConfirm: '是否确认删除岗位编号为"{ids}"的数据项？',
    deleteSuccess: '删除成功',
    dialog: {
      create: '添加岗位',
      edit: '修改岗位'
    },
    field: {
      postId: '岗位编号',
      postCode: '岗位编码',
      postName: '岗位名称',
      postSort: '岗位顺序',
      postSortOrder: '岗位排序',
      postStatus: '岗位状态',
      status: '状态',
      createTime: '创建时间',
      remark: '备注'
    },
    placeholder: {
      postCode: '请输入岗位编码',
      postName: '请输入岗位名称',
      status: '岗位状态',
      remark: '请输入内容'
    },
    rule: {
      postName: '岗位名称不能为空',
      postCode: '岗位编码不能为空',
      postSort: '岗位顺序不能为空'
    }
  },
  systemConfig: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '参数数据集',
    listTitle: '参数列表',
    listSummary: '共 {total} 条记录，支持键值维护、导出和缓存刷新。',
    emptyText: '暂无参数数据',
    refreshCache: '刷新缓存',
    refreshCacheSuccess: '刷新缓存成功',
    deleteConfirm: '是否确认删除参数编号为"{ids}"的数据项？',
    deleteSuccess: '删除成功',
    dialog: {
      create: '添加参数',
      edit: '修改参数'
    },
    field: {
      configName: '参数名称',
      configKey: '参数键名',
      configValue: '参数键值',
      configType: '系统内置',
      remark: '备注',
      createTime: '创建时间'
    },
    placeholder: {
      configName: '请输入参数名称',
      configKey: '请输入参数键名',
      configValue: '请输入参数键值',
      remark: '请输入内容'
    },
    rule: {
      configName: '参数名称不能为空',
      configKey: '参数键名不能为空',
      configValue: '参数键值不能为空'
    }
  },
  systemDept: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '部门数据集',
    listTitle: '部门列表',
    listSummary: '支持树形层级维护、负责人绑定和部门状态管理。',
    emptyText: '暂无部门数据',
    syncDept: '同步部门',
    syncDomainUsers: '同步域账号用户',
    syncDeptConfirm: '确认从 AD 组织架构同步部门数据吗？',
    syncDeptSuccess: '部门同步成功',
    selectSyncDept: '请选择要同步的部门',
    syncDomainUsersConfirm: '确认同步"{name}"部门下的域账号用户吗？',
    syncDomainUsersSuccess: '域账号用户同步成功',
    deleteConfirm: '是否确认删除名称为"{name}"的数据项？',
    deleteSuccess: '删除成功',
    userSettings: {
      action: '设置管理员与默认角色',
      title: '设置"{name}"部门管理员与默认角色',
      managerTab: '管理员设置',
      defaultRoleTab: '默认角色设置',
      currentDept: '当前部门：',
      currentDeptLabel: '当前部门',
      defaultRole: '默认角色',
      defaultRolePlaceholder: '请选择默认角色',
      managerTitle: '部门管理员',
      managerSummary: '已选管理员（{total}/10）',
      managerNotice: '管理员负责管理该部门及其成员，最多可设置 10 位管理员',
      managerLimitWarning: '最多只能设置 {max} 位部门管理员',
      clearManagers: '清空',
      noManagers: '暂无部门管理员',
      availableUsers: '可选用户',
      userNameOrName: '用户名/姓名',
      userNameOrNamePlaceholder: '请输入用户名或姓名',
      currentDeptUsers: '本部门用户',
      otherDeptUsers: '搜索其他部门用户',
      setManager: '设为管理员',
      cancelManager: '取消管理员',
      noCurrentDeptUsers: '暂无本部门用户',
      otherSearchHint: '输入用户名或昵称后搜索其他部门用户',
      otherSearchRequired: '请输入用户名或昵称后再搜索',
      noOtherUsers: '暂无匹配的其他部门用户',
      defaultRoleNotice: '新成员加入该部门时，将自动分配所选的默认角色',
      selectedRoleInfo: '已选角色信息',
      selectedRoleEmptyTitle: '尚未选择默认角色',
      selectedRoleEmptyDesc: '选择角色后将作为新成员的默认角色',
      selectedRoleReadyTitle: '选择默认角色：{role}',
      selectedRoleReadyDesc: '保存后该角色将作为当前部门新成员的默认角色',
      saveSuccess: '部门用户设置保存成功'
    },
    dialog: {
      create: '添加部门',
      edit: '修改部门'
    },
    field: {
      parentDept: '上级部门',
      deptName: '部门名称',
      orderNum: '排序',
      displayOrder: '显示排序',
      leader: '负责人',
      phone: '联系电话',
      email: '邮箱',
      status: '状态',
      deptStatus: '部门状态',
      createTime: '创建时间'
    },
    placeholder: {
      parentDept: '选择上级部门',
      deptName: '请输入部门名称',
      status: '部门状态',
      leader: '请输入负责人',
      phone: '请输入联系电话',
      email: '请输入邮箱'
    },
    rule: {
      parentId: '上级部门不能为空',
      deptName: '部门名称不能为空',
      orderNum: '显示排序不能为空',
      email: '请输入正确的邮箱地址',
      phone: '请输入正确的手机号码'
    }
  },
  systemMenu: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '菜单数据集',
    listTitle: '菜单列表',
    listSummary: '支持树形加载、图标选择和目录/菜单/按钮三级维护。',
    emptyText: '暂无菜单数据',
    importTitle: '菜单导入',
    importPickFile: '点击选择',
    importFileTip: '仅允许导入 xls、xlsx 格式文件。',
    importSuccess: '导入成功',
    topCategory: '主类目',
    deleteConfirm: '是否确认删除名称为"{name}"的数据项？',
    deleteSuccess: '删除成功',
    dialog: {
      create: '添加菜单',
      edit: '修改菜单'
    },
    type: {
      directory: '目录',
      menu: '菜单',
      button: '按钮',
      externalLink: '外链'
    },
    cache: {
      cache: '缓存',
      noCache: '不缓存'
    },
    field: {
      app: '归属应用',
      parentMenu: '上级菜单',
      menuType: '菜单类型',
      icon: '菜单图标',
      menuName: '菜单名称',
      menuCode: '编码',
      displayOrder: '显示排序',
      orderNum: '排序',
      isFrame: '是否外链',
      path: '路由地址',
      component: '组件路径',
      permission: '权限字符',
      query: '路由参数',
      isCache: '是否缓存',
      visible: '显示状态',
      status: '状态',
      menuStatus: '菜单状态',
      activeMenu: '激活路由',
      remark: '备注',
      uploadFile: '上传文件',
      type: '类型'
    },
    placeholder: {
      app: '请选择归属应用',
      parentMenu: '选择上级菜单',
      menuName: '请输入菜单名称',
      menuCode: '请输入编码',
      status: '菜单状态',
      path: '请输入路由地址',
      component: '请输入组件路径',
      permission: '请输入权限标识',
      query: '请输入路由参数',
      activeMenu: '请输入激活路径',
      remark: '请输入备注'
    },
    tooltip: {
      isFrame: '选择是外链则路由地址需要以 http(s):// 开头',
      path: '访问的路由地址，如 user；如外网地址需内链访问则以 http(s):// 开头',
      component: '访问的组件路径，如 system/user/index，默认在 views 目录下',
      permission: "控制器中定义的权限字符，如 SaCheckPermission('system:user:list')",
      query: '访问路由的默认传递参数，如 id=1、name=ry',
      isCache: '选择是则会被 keep-alive 缓存，需要匹配组件的 name 和地址保持一致',
      visible: '选择隐藏则路由将不会出现在侧边栏，但仍然可以访问',
      status: '选择停用则路由将不会出现在侧边栏，也不能被访问',
      activeMenu: '隐藏菜单填写默认激活路由，比如激活父菜单的路由 /system/user'
    },
    rule: {
      app: '请选择归属应用',
      importFile: '请选择要导入的文件',
      menuName: '菜单名称不能为空',
      orderNum: '菜单顺序不能为空',
      path: '路由地址不能为空'
    }
  },
  systemNotice: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '公告数据集',
    listTitle: '公告列表',
    listSummary: '共 {total} 条记录，支持类型筛选、内容编辑和状态管理。',
    emptyText: '暂无公告数据',
    emptyContent: '暂无公告内容',
    detailTitle: '公告详情',
    deleteConfirm: '是否确认删除公告编号为"{ids}"的数据项？',
    deleteSuccess: '删除成功',
    dialog: {
      create: '添加公告',
      edit: '修改公告'
    },
    detail: {
      type: '类型：',
      status: '状态：',
      creator: '创建者：',
      createTime: '创建时间：'
    },
    field: {
      noticeTitle: '公告标题',
      operator: '操作人员',
      type: '类型',
      noticeType: '公告类型',
      status: '状态',
      creator: '创建者',
      createTime: '创建时间',
      content: '内容'
    },
    placeholder: {
      noticeTitle: '请输入公告标题',
      operator: '请输入操作人员',
      type: '公告类型',
      select: '请选择'
    },
    rule: {
      noticeTitle: '公告标题不能为空',
      noticeType: '公告类型不能为空'
    }
  },
  systemDict: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '字典数据集',
    listTitle: '字典列表',
    listSummary: '共 {total} 条记录，点击“字典数据”进入对应字典数据。',
    emptyText: '暂无字典类型数据',
    refreshCache: '刷新缓存',
    refreshSuccess: '刷新成功',
    deleteConfirm: '是否确认删除字典编号为"{ids}"的数据项？',
    deleteSuccess: '删除成功',
    dialog: {
      create: '添加字典类型',
      edit: '修改字典类型'
    },
    action: {
      data: '字典数据'
    },
    field: {
      dictId: '字典编号',
      dictName: '字典名称',
      dictType: '字典类型',
      status: '状态',
      remark: '备注',
      createTime: '创建时间'
    },
    placeholder: {
      dictName: '请输入字典名称',
      dictType: '请输入字典类型',
      status: '字典状态',
      remark: '请输入内容'
    },
    rule: {
      dictName: '字典名称不能为空',
      dictType: '字典类型不能为空'
    }
  },
  systemDictData: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '字典数据',
    listTitle: '字典数据',
    listSummary: '{summary}，共 {total} 条记录。',
    loadingSummary: '正在读取字典类型',
    emptyText: '暂无字典数据',
    missingDictId: '缺少字典编号，无法加载字典数据',
    selectDictTypeFirst: '请先选择字典类型',
    deleteConfirm: '是否确认删除字典编码为"{ids}"的数据项？',
    deleteSuccess: '删除成功',
    dialog: {
      create: '添加字典数据',
      edit: '修改字典数据'
    },
    listClass: {
      default: '默认(default)',
      primary: '主要(primary)',
      success: '成功(success)',
      info: '信息(info)',
      warning: '警告(warning)',
      danger: '危险(danger)'
    },
    field: {
      dictCode: '字典编码',
      dictType: '字典类型',
      dictLabel: '数据标签',
      dictValue: '数据键值',
      dictSort: '字典排序',
      displayOrder: '显示排序',
      cssClass: '样式属性',
      listClass: '回显样式',
      status: '状态',
      remark: '备注',
      createTime: '创建时间'
    },
    placeholder: {
      dictLabel: '请输入字典标签',
      dataLabel: '请输入数据标签',
      dataValue: '请输入数据键值',
      cssClass: '请输入样式属性',
      remark: '请输入内容',
      status: '数据状态'
    },
    rule: {
      dictLabel: '数据标签不能为空',
      dictValue: '数据键值不能为空',
      dictSort: '数据顺序不能为空'
    }
  },
  systemRole: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '角色数据集',
    listTitle: '角色列表',
    listSummary: '共 {total} 条记录，支持菜单权限、数据权限和分配用户等完整配置流程。',
    emptyText: '暂无角色数据',
    deleteConfirm: '是否确认删除角色编号为"{ids}"的数据项？',
    deleteSuccess: '删除成功',
    statusChangeConfirm: '确认要{action}“{name}”角色吗？',
    statusChangeSuccess: '{action}成功',
    permissionUpdateSuccess: '修改成功',
    dataScope: {
      all: '全部数据权限',
      custom: '自定数据权限',
      dept: '本部门数据权限',
      deptAndChildren: '本部门及以下数据权限',
      self: '仅本人数据权限'
    },
    dialog: {
      create: '添加角色',
      edit: '修改角色',
      assignPermission: '分配权限'
    },
    action: {
      assignPermission: '分配权限',
      assignUser: '分配用户'
    },
    field: {
      roleName: '角色名称',
      roleKey: '权限字符',
      roleSort: '角色顺序',
      dept: '可见部门',
      displayOrder: '显示顺序',
      status: '状态',
      createTime: '创建时间',
      remark: '备注'
    },
    placeholder: {
      roleName: '请输入角色名称',
      roleKey: '请输入权限字符',
      dept: '请选择可见部门',
      status: '角色状态',
      startDate: '开始日期',
      endDate: '结束日期',
      remark: '请输入内容'
    },
    rule: {
      roleName: '角色名称不能为空',
      roleKey: '权限字符不能为空',
      roleSort: '角色顺序不能为空'
    },
    tooltip: {
      roleKey: "控制器中定义的权限字符，如 SaCheckRole('admin')"
    },
    protectedAdmin: {
      delete: '超级管理员角色不允许删除',
      disable: '超级管理员角色不允许停用',
      assignUser: '超级管理员角色不允许分配用户',
      edit: '超级管理员角色不允许修改',
      assignPermission: '超级管理员角色不允许分配权限'
    },
    statusAction: {
      enable: '启用',
      disable: '停用'
    }
  },
  systemRolePermission: {
    tab: {
      menu: '菜单权限',
      data: '数据权限'
    },
    toggle: {
      expand: '展开/折叠',
      selectAll: '全选/全不选',
      parentChild: '父子联动'
    },
    header: {
      menuName: '菜单名称',
      buttonPermission: '按钮权限'
    },
    loading: '加载中，请稍候',
    emptyMenu: '暂无菜单',
    status: {
      hidden: '隐藏',
      disabled: '停用'
    },
    field: {
      permissionScope: '权限范围',
      dataPermission: '数据权限'
    }
  },
  systemRoleAuthUser: {
    filterTitle: '筛选条件',
    listTitle: '已授权用户',
    emptyText: '暂无授权用户',
    action: {
      addUser: '添加用户',
      cancelBatch: '批量取消授权',
      cancelAuth: '取消授权'
    },
    field: {
      userName: '用户名称',
      nickName: '用户昵称',
      email: '邮箱',
      phone: '手机',
      phonenumber: '手机号码',
      status: '状态',
      createTime: '创建时间'
    },
    placeholder: {
      userName: '请输入用户名称',
      phonenumber: '请输入手机号码'
    },
    cancelConfirm: '确认要取消该用户“{name}”的角色吗？',
    cancelBatchConfirm: '是否取消选中用户授权数据项？',
    cancelSuccess: '取消授权成功'
  },
  systemRoleSelectUser: {
    title: '选择用户',
    emptyText: '暂无可分配用户',
    selectRequired: '请选择要分配的用户',
    assignSuccess: '分配成功'
  },
  monitorDruid: {
    title: '提示',
    subtitle: '当前数据监控页面仍在完善中。',
    backHome: '返回首页'
  },
  monitorOnline: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '在线会话',
    listTitle: '在线用户',
    listSummary: '共 {total} 条记录，支持按账号或地址检索并执行会话强退。',
    emptyText: '暂无在线用户数据',
    forceLogoutConfirm: '是否确认强退名称为“{name}”的用户？',
    forceLogoutSuccess: '强退成功',
    action: {
      forceLogout: '强退'
    },
    field: {
      index: '序号',
      tokenId: '会话编号',
      userName: '用户名称',
      loginName: '登录名称',
      deptName: '所属部门',
      loginAddress: '登录地址',
      host: '主机',
      loginLocation: '登录地点',
      os: '操作系统',
      browser: '浏览器',
      loginTime: '登录时间'
    },
    placeholder: {
      ipaddr: '请输入登录地址',
      userName: '请输入用户名称'
    }
  },
  monitorCache: {
    overviewTitle: '缓存概览',
    overviewSummary: 'Redis 运行状态、资源消耗与实时统计。',
    commandStatsTitle: '命令统计',
    memoryInfoTitle: '内存信息',
    loading: '正在加载缓存监控数据，请稍候！',
    chartContainerMissing: '缓存监控图表容器未挂载，无法初始化 ECharts。',
    field: {
      redisVersion: 'Redis版本',
      runMode: '运行模式',
      port: '端口',
      clients: '客户端数',
      uptimeDays: '运行时间(天)',
      usedMemory: '使用内存',
      usedCpu: '使用CPU',
      memoryConfig: '内存配置',
      aofEnabled: 'AOF是否开启',
      rdbSuccess: 'RDB是否成功',
      keyCount: 'Key数量',
      networkIo: '网络入口/出口'
    },
    value: {
      standalone: '单机',
      cluster: '集群'
    },
    chart: {
      command: '命令',
      peak: '峰值',
      memoryUsage: '内存消耗'
    }
  },
  monitorCacheList: {
    cacheNameTitle: '缓存列表',
    cacheKeyTitle: '键名列表',
    cacheContentTitle: '缓存内容',
    field: {
      cacheName: '缓存名称',
      cacheKey: '缓存键名',
      cacheValue: '缓存内容'
    },
    empty: {
      cacheNames: '暂无缓存数据',
      cacheKeys: '暂无缓存键名'
    },
    action: {
      clear: '清理',
      clearAll: '清理全部',
      refreshCacheNames: '刷新缓存列表',
      refreshCacheKeys: '刷新键名列表'
    },
    message: {
      refreshCacheNamesSuccess: '刷新缓存列表成功',
      refreshCacheKeysSuccess: '刷新键名列表成功',
      clearCacheNameSuccess: '清理缓存名称[{name}]成功',
      clearCacheKeySuccess: '清理缓存键名[{key}]成功',
      clearAllConfirm: '是否确认清理全部缓存？',
      clearAllSuccess: '清理全部缓存成功'
    }
  },
  monitorServer: {
    memoryTitle: '内存',
    serverInfoTitle: '服务器信息',
    clrInfoTitle: '.NET CLR 信息',
    diskTitle: '磁盘状态',
    empty: {
      memory: '暂无内存数据',
      disk: '暂无磁盘数据'
    },
    value: {
      noData: '暂无'
    },
    memory: {
      total: '总内存',
      used: '已用内存',
      free: '剩余内存',
      usage: '使用率'
    },
    field: {
      cpuNum: '核心数',
      cpuTotal: '使用率',
      cpuUsed: '用户使用率',
      cpuSys: '系统使用率',
      cpuFree: '当前空闲率',
      computerName: '服务器名称',
      osName: '操作系统',
      computerIp: '服务器IP',
      osArch: '系统架构',
      clrName: '.NET 名称',
      clrVersion: '.NET 版本',
      startTime: '启动时间',
      runTime: '运行时长',
      home: '安装路径',
      userDir: '项目路径',
      inputArgs: '运行参数',
      property: '属性',
      dirName: '盘符路径',
      sysTypeName: '文件系统',
      typeName: '盘符类型',
      total: '总大小',
      free: '可用大小',
      used: '已用大小',
      usage: '已用百分比'
    }
  },
  monitorLoginInfo: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '访问日志',
    listTitle: '登录日志',
    listSummary: '共 {total} 条记录，支持排序、批量清理、导出和账号解锁。',
    emptyText: '暂无登录日志数据',
    deleteConfirm: '是否确认删除访问编号为"{ids}"的数据项？',
    cleanConfirm: '是否确认清空所有登录日志数据项？',
    cleanSuccess: '清空成功',
    unlockConfirm: '是否确认解锁用户"{name}"数据项？',
    unlockSuccess: '用户{name}解锁成功',
    action: {
      unlock: '解锁'
    },
    field: {
      infoId: '访问编号',
      userName: '用户名称',
      ipaddr: '登录地址',
      address: '地址',
      loginLocation: '登录地点',
      os: '操作系统',
      browser: '浏览器',
      status: '登录状态',
      msg: '描述',
      loginTime: '登录时间',
      accessTime: '访问时间'
    },
    placeholder: {
      ipaddr: '请输入登录地址',
      userName: '请输入用户名称',
      status: '登录状态'
    }
  },
  monitorOperlog: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '操作日志',
    listTitle: '操作日志',
    listSummary: '共 {total} 条记录，支持类型过滤、详情查看、批量清空和导出。',
    emptyText: '暂无操作日志数据',
    detailTitle: '操作日志详细',
    deleteConfirm: '是否确认删除日志编号为"{ids}"的数据项？',
    cleanConfirm: '是否确认清空所有操作日志数据项？',
    cleanSuccess: '清空成功',
    costTimeValue: '{value}毫秒',
    status: {
      normal: '正常',
      failed: '失败'
    },
    field: {
      operId: '日志编号',
      title: '系统模块',
      operName: '操作人员',
      operIp: '操作地址',
      type: '类型',
      businessType: '操作类型',
      status: '操作状态',
      operTime: '操作时间',
      operDate: '操作日期',
      deptName: '部门',
      costTime: '消耗时间'
    },
    placeholder: {
      operIp: '请输入操作地址',
      title: '请输入系统模块',
      operName: '请输入操作人员',
      businessType: '操作类型',
      status: '操作状态'
    },
    detail: {
      status: '操作状态',
      loginInfo: '登录信息',
      requestInfo: '请求信息',
      operationModule: '操作模块',
      operationMethod: '操作方法',
      requestParams: '请求参数',
      responseParams: '返回参数',
      costTime: '消耗时间',
      operationTime: '操作时间',
      errorInfo: '异常信息'
    }
  },
  monitorJob: {
    searchKicker: '搜索筛选',
    filterTitle: '筛选条件',
    listKicker: '调度任务',
    listTitle: '定时任务',
    listSummary: '共 {total} 条记录，支持任务维护、启停、立即执行和调度日志查看。',
    emptyText: '暂无定时任务数据',
    logEmptyText: '暂无调度日志数据',
    detailTitle: '任务详细',
    logTitle: '调度日志',
    logDetailTitle: '调度日志详细',
    enabledEditBlocked: '运行中的定时任务不能直接修改，请先停用任务后再调整配置。',
    cronInvalid: 'Cron 表达式无效',
    deleteConfirm: '是否确认删除定时任务编号为"{ids}"的数据项？',
    statusConfirm: '确认要{action}任务"{name}"吗？',
    statusSuccess: '{action}成功',
    runConfirm: '确认要立即执行一次"{name}"任务吗？',
    runSuccess: '执行成功',
    logDetailMissing: '调度日志详情接口未返回数据',
    logDeleteConfirm: '是否确认删除调度日志编号为"{ids}"的数据项？',
    logCleanConfirm: '是否确认清空所有调度日志数据项？',
    logCleanSuccess: '清空成功',
    action: {
      log: '日志',
      runOnce: '执行一次',
      enable: '启用',
      disable: '停用'
    },
    form: {
      addTitle: '添加任务',
      editTitle: '修改任务'
    },
    field: {
      jobId: '任务编号',
      jobName: '任务名称',
      jobGroupName: '任务组名',
      jobGroup: '任务分组',
      createTime: '创建时间',
      cronExpression: 'Cron 表达式',
      cronExecuteExpression: 'Cron 执行表达式',
      nextValidTime: '下次执行时间',
      invokeTarget: '调用目标方法',
      invokeMethod: '调用方法',
      jobStatus: '任务状态',
      concurrent: '是否并发',
      misfirePolicy: '执行策略',
      executionStatus: '执行状态',
      executionTime: '执行时间',
      jobLogId: '日志编号',
      jobMessage: '日志信息',
      exceptionInfo: '异常信息'
    },
    placeholder: {
      jobName: '请输入任务名称',
      jobGroupName: '请选择任务组名',
      jobGroup: '请选择任务分组',
      jobStatus: '请选择任务状态',
      executionStatus: '请选择执行状态',
      invokeTarget: '请输入调用目标字符串'
    },
    rule: {
      jobName: '任务名称不能为空',
      jobGroup: '任务分组不能为空',
      invokeTarget: '调用目标字符串不能为空',
      cronExpression: 'Cron 执行表达式不能为空'
    },
    misfirePolicy: {
      immediate: '立即执行',
      once: '执行一次',
      abandon: '放弃执行'
    },
    concurrent: {
      allow: '允许',
      forbid: '禁止'
    }
  },
  routeDiagnostics: {
    duplicateRouteTitle: '路由名称重复',
    duplicateRouteMessage: '路由名称 [{name}] 重复，可能造成页面 404'
  },
  profile: {
    tabsLabel: '个人中心页签',
    basicInfo: '基本资料',
    avatarOnlyNotice: '除头像外，其他资料不可在个人中心修改。',
    profileLoadFailed: '个人资料加载失败',
    profileUpdated: '修改成功',
    avatarTitle: '修改头像',
    avatarUploadTitle: '点击上传头像',
    avatarAlt: '当前头像',
    avatarPreview: '头像预览',
    avatarSelect: '选择',
    avatarSubmit: '提交',
    avatarZoomIn: '放大头像',
    avatarZoomOut: '缩小头像',
    avatarRotateLeft: '向左旋转',
    avatarRotateRight: '向右旋转',
    avatarInvalidType: '文件格式错误，请上传图片类型，如：JPG、PNG 后缀的文件。',
    listSeparator: '、',
    field: {
      phonenumber: '手机号码',
      email: '用户邮箱',
      dept: '所属部门',
      role: '所属角色',
      post: '所属岗位',
      createTime: '创建日期',
      loginDate: '最近登录',
      sex: '性别'
    },
    social: {
      tab: '第三方账号管理',
      empty: '暂无第三方账号数据',
      loadFailed: '第三方账号加载失败',
      bound: '已绑定',
      unbound: '未绑定',
      unbind: '解绑',
      unbindConfirm: '确认解绑 {name} 账号？解绑后将不能继续通过该第三方账号登录。',
      unbindSuccess: '解绑成功',
      source: {
        dingtalk: '钉钉',
        wecom: '企业微信'
      },
      field: {
        email: '账号邮箱',
        bindTime: '绑定时间',
        lastLoginTime: '最近登录'
      }
    }
  }
};
