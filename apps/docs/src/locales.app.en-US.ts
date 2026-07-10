export default {
  aria: {
    changeLanguage: 'Change language',
    closeSearch: 'Close search',
    currentDocumentToc: 'Current document outline',
    pageLoading: 'Page loading',
    searchAppsMenus: 'Search apps, systems, and menus',
    workspace: 'Unified authentication workspace',
    workspaceMetrics: 'Workspace metrics'
  },
  auth: {
    accountHeroAria: 'Unified identity authentication introduction',
    accountCardAria: 'Domain account login',
    heroKicker: 'Unified Identity Platform',
    heroTitle: 'HYN Unified Identity Center',
    heroSubtitle: 'A secure, efficient, and convenient identity and access platform',
    metricOAuthTitle: 'OAuth2.0',
    metricOAuth: 'Standard Authorization',
    metricSSOTitle: 'SSO',
    metricSSO: 'Unified Entry',
    metricSecurityTitle: 'Security',
    metricSecurity: 'Trusted Auth',
    accountPanelKicker: 'Enterprise Identity',
    accountPanelTitle: 'Domain Account Login',
    accountPanelDescription: 'Use your enterprise domain account to enter the unified identity platform',
    accountLabel: 'Account',
    accountPlaceholder: 'Enter employee ID, email, or mobile number',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    captchaLabel: 'Captcha',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    passwordGuide: {
      title: 'Password Reset Guide',
      kicker: 'ITAD Self-Service',
      steps: {
        openWorkbench: {
          title: 'Open Workbench',
          description: 'Open DingTalk and click Workbench on the left.'
        },
        findItad: {
          title: 'Find ITAD Self-Service',
          description: 'Find ITAD Self-Service in the app list on the right, or enter ITAD in the top search box.'
        },
        selectReset: {
          title: 'Choose Reset Password',
          description: 'Open the app and choose Reset Password to set a new password.'
        },
        submitEffective: {
          title: 'Submit to Take Effect',
          description:
            'The new password takes effect immediately after submission. If the reset fails, contact the IT Service Desk for help.'
        }
      },
      help: 'For help, contact your IT Service Desk or administrator.',
      imageAlt: 'Screenshot of the DingTalk ITAD Self-Service password reset entry'
    },
    login: 'Login',
    otherLogin: 'Other Login Methods',
    dingtalkLogin: 'DingTalk Scan Login',
    agreementPrefix: 'By logging in, you agree to',
    userAgreement: 'User Agreement',
    privacyPolicy: 'Privacy Policy',
    agreementJoiner: 'and',
    requiredWarning: 'Please complete the required fields',
    scan: {
      aria: 'DingTalk scan login',
      kicker: 'Scan Login',
      title: 'DingTalk Scan Login',
      subtitle: 'Authorize with DingTalk and the system will verify the account binding status',
      generatingTitle: 'Generating secure QR code',
      generatingTip: 'Please wait, then scan with DingTalk',
      authorizingTitle: 'Authorizing login',
      authorizingTip: 'Authorization code received. Verifying account binding',
      errorTitle: 'QR code failed to load',
      errorTip: 'Check the scan configuration API, SDK URL, and console errors',
      reload: 'Reload QR Code',
      backAccount: 'Back to domain account login',
      registerAccount: 'Register account'
    },
    binding: {
      artAria: 'Binding security illustration',
      contentAria: 'User binding',
      artKicker: 'Account Binding',
      artTitle: 'Confirm DingTalk identity and bind an enterprise domain account',
      artSubtitle: 'After binding succeeds, the system will use this domain account for unified authentication.',
      panelKicker: 'DingTalk Identity',
      panelTitle: 'User Binding',
      panelDescription: 'Use your enterprise domain account to confirm the binding.',
      pending: 'Pending binding',
      domainAccountLabel: 'Domain account',
      bind: 'Bind',
      successTip: 'After binding succeeds, the system will automatically log you in with this domain account',
      validationWarning: 'Please enter the domain account and password',
      metaText: '{label}: {value}',
      email: 'Email',
      dingTalkUserId: 'DingTalk User ID',
      openId: 'OpenID',
      department: 'Department',
      title: 'Title'
    },
    success: {
      artAria: 'Binding success illustration',
      contentAria: 'Binding successful',
      artKicker: 'Binding Complete',
      artTitle: 'Unified authentication relationship established',
      artSubtitle: 'You can use DingTalk identity for a lighter authorization login next time.',
      title: 'Binding Successful',
      redirecting: 'Redirecting you to the system page',
      backAccount: 'Back to account login'
    },
    authorization: {
      aria: 'Authorization login account confirmation',
      kicker: 'Authorization',
      title: 'Choose an account to sign in',
      subtitle: 'Continue unified authentication authorization with the account already signed in.',
      continueWithAccount: 'Authorize with this account',
      authorizing: 'Redirecting to authorization...',
      useOtherAccount: 'Use another account',
      missingRedirectUrl: 'Missing authorization redirect URL. Authorization cannot continue.',
      unknownUser: 'Current user',
      accountLabel: 'Account',
      employeeNoLabel: 'Employee ID',
      nicknameLabel: 'Name',
      emailLabel: 'Email',
      mobileLabel: 'Mobile',
      privacyNote:
        'After confirmation, the browser only opens the app-provided URL. This page does not append user data or tokens.'
    },
    flow: {
      preloading: 'Loading...',
      missingBoundToken: 'The DingTalk account is bound, but the backend did not return a system login token',
      missingScanIdentity: 'Missing DingTalk scan identity. Please scan again',
      bindingUsernameRequired: 'Enter employee ID, email, or mobile number',
      bindingPasswordRequired: 'Enter password'
    }
  },
  common: {
    action: 'Actions',
    add: 'Add',
    back: 'Back',
    clear: 'Clear',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    delete: 'Delete',
    deleteSuccess: 'Deleted successfully',
    detail: 'Details',
    edit: 'Edit',
    endDate: 'End date',
    export: 'Export',
    hideSearch: 'Hide search',
    import: 'Import',
    index: 'No.',
    loading: 'Loading...',
    loadingMore: 'Loading more...',
    more: 'More',
    noData: 'No data',
    no: 'No',
    refresh: 'Refresh',
    remark: 'Remark',
    reset: 'Reset',
    search: 'Search',
    showColumns: 'Show/Hide columns',
    showSearch: 'Show search',
    startDate: 'Start date',
    status: 'Status',
    submit: 'Submit',
    success: 'Operation successful',
    yes: 'Yes'
  },
  hynForm: {
    inputPlaceholder: 'Enter {label}',
    selectPlaceholder: 'Select {label}',
    required: '{label} is required',
    filePicker: {
      chooseFile: 'Choose file',
      dragText: 'Drop files here, or',
      fileTypeSeparator: ', ',
      typeTip: 'Only {types} files are allowed.',
      invalidType: 'Invalid file type. Please choose {types} files.',
      invalidSize: 'File size must not exceed {size} MB',
      singleFileOnly: 'Only one file can be selected'
    }
  },
  hynTreeSelect: {
    searchPlaceholder: 'Search node name or ID',
    linkage: 'Parent-child',
    linkageEnabledTip: 'On: selecting a parent also selects all descendants',
    linkageDisabledTip: 'Off: parent and child nodes can be selected independently'
  },
  generator: {
    addTitle: 'Add {name}',
    collapseAll: 'Collapse All',
    deleteConfirm: 'Are you sure you want to delete {name} item "{id}"?',
    deleteSuccess: 'Deleted successfully',
    dictOptionPlaceholder: 'Select a dictionary option',
    disable: 'Disable',
    emptyData: 'No {name} data',
    enable: 'Enable',
    endDate: 'End date',
    expandOne: 'Expand One Level',
    filterConditions: 'Filters',
    inputPlaceholder: 'Enter {label}',
    editTitle: 'Edit {name}',
    listTitle: '{name} List',
    required: '{label} is required',
    selectPlaceholder: 'Select {label}',
    sortSuccess: 'Sort order updated successfully',
    startDate: 'Start date',
    statusConfirm: 'Are you sure you want to {action}?',
    statusSuccess: '{action} successful',
    topNode: 'Top Node'
  },
  language: {
    english: 'English',
    simplifiedChinese: 'Simplified Chinese',
    unsupportedCommand: 'Unsupported language switch command: {command}'
  },
  modal: {
    systemTip: 'System Notice'
  },
  brand: {
    logoAlt: 'HYN',
    title: 'SSO Unified Authentication'
  },
  settings: {
    navTitle: 'Navigation Settings',
    navLeft: 'Left Menu',
    navMix: 'Mixed Menu',
    navTop: 'Top Menu',
    themeTitle: 'Theme Style',
    checkIcon: 'Icon: check',
    themeColor: 'Theme Color',
    darkMode: 'Dark Mode',
    pageRadius: 'Page Radius',
    layoutTitle: 'System Layout',
    tagsView: 'Enable Tags-Views',
    tagsViewPersist: 'Persist Tags',
    tagsIcon: 'Show Tab Icons',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Show Logo',
    saveConfig: 'Save Settings',
    resetConfig: 'Reset Settings',
    saving: 'Saving locally, please wait...',
    resetting: 'Clearing settings cache and refreshing, please wait...'
  },
  iconSelect: {
    choose: 'Click to choose an icon',
    search: 'Search icons',
    customHint: 'You can also enter an Iconify icon name directly',
    customPlaceholder: 'Example: mdi:account-circle-outline',
    use: 'Use'
  },
  sizeSelect: {
    large: 'Large',
    default: 'Default',
    small: 'Small'
  },
  treePanel: {
    placeholder: 'Enter name',
    disabled: 'Disabled'
  },
  errorPage: {
    forbiddenCode: '401 Error!',
    forbiddenTitle: 'You do not have access.',
    forbiddenDescription:
      'Sorry, you do not have access. Please do not perform unauthorized operations. You can return to the home page.',
    backHomeShort: 'Home',
    notFoundCode: '404 Error!',
    notFoundTitle: 'Page not found.',
    notFoundDescription:
      'Sorry, the page you are looking for does not exist. Check the URL, refresh the browser, or try finding other content in the application.',
    backHome: 'Back to Home',
    backendEyebrow: 'System Message',
    backendTitle: 'Error',
    backendMessageAria: 'Backend error message'
  },
  navbar: {
    admin: 'Administrator',
    workspaceRole: 'Workspace'
  },
  request: {
    duplicateSubmit: 'Data is being processed. Please do not submit again.',
    downloadError: 'File download failed. Please contact the administrator.',
    downloadLoading: 'Downloading data, please wait...',
    networkError: 'Backend API connection error',
    timeout: 'System API request timed out',
    statusError: 'System API {status} error',
    unauthorized: 'The session is invalid or expired. Please log in again.',
    reloginConfirm: 'Your login session has expired. You can stay on this page or log in again.',
    relogin: 'Log in again',
    contractError: 'API response does not match the code/msg/data contract: {reason}; {context}; response={response}',
    contractObject: 'Response must be an object',
    contractMissingFields: 'Missing fields: {fields}',
    contractExtraFields: 'Unexpected fields: {fields}',
    contractCodeType: 'code must be number, actual type is {actual}',
    contractMsgType: 'msg must be string, actual type is {actual}',
    unknownError: 'Unknown system error. Please contact the administrator.'
  },
  route: {
    home: 'Home',
    profile: 'Profile',
    error: 'Error',
    applicationSwitch: 'Application Switch',
    assignRole: 'Assign Roles',
    assignUser: 'Assign Users',
    dictData: 'Dictionary Data',
    editGeneratorConfig: 'Edit Generator Config'
  },
  register: {
    brandPill: 'YZL SSO Workspace',
    brandTitle: 'SSO Authentication Platform',
    brandDescLine1:
      'A unified authentication entry for internal enterprise apps, covering account login, dynamic permissions, organization users, and security audit.',
    brandDescLine2:
      'Connect business systems around SSO so users can reach the authorized workspace after one authentication.',
    highlightTech: 'Upgraded Tech Stack',
    highlightMenu: 'Dynamic Menus',
    highlightLayout: 'Multiple Layouts',
    highlightTheme: 'Light and Dark Themes',
    metricPermissionLabel: 'Fine-grained Permissions',
    metricPermissionValue: 'Dynamic Access Control',
    metricStackLabel: 'Modern Stack',
    metricStackValue: 'Full-stack Integration',
    metricUiLabel: 'UI Style',
    metricUiValue: 'Card Layout',
    eyebrow: 'Workspace Register',
    subtitle: 'Create a new business workspace account and connect it to the current permission and login system.',
    registerTip: 'After registration, you will return to the login page to continue authentication',
    copyright: 'Copyright © 2018-{year} YZL All Rights Reserved.'
  },
  search: {
    history: 'Search History',
    hotApps: 'Popular Apps',
    recommendationCount: '{count} recommendations',
    foundCount: '{count} results found',
    emptyText: 'No results for "{keyword}"',
    emptyTip: 'Try another app name, system name, or menu path',
    app: 'App',
    menu: 'Menu',
    shortcutSwitch: 'Switch',
    shortcutOpen: 'Ctrl K',
    shortcutEnterKey: 'Enter',
    shortcutEscKey: 'Esc',
    shortcutSelect: 'Select',
    shortcutClose: 'Close',
    triggerPlaceholder: 'Search apps, systems, and menus...',
    applicationLoadFailed: 'Failed to load app search data: {message}',
    unnamedApp: 'Unnamed App',
    applicationCenter: 'App Center',
    authorizationPending: 'Authorization entry API is not configured. This visit has been recorded.'
  },
  upload: {
    pickFile: 'Select File',
    uploadPrefix: 'Please upload',
    uploadSizePrefix: 'size no larger than',
    uploadTypePrefix: 'format',
    uploadSuffix: 'files',
    deleteFile: 'Delete',
    invalidType: 'Invalid file format. Please upload {types} files.',
    invalidName: 'Invalid file name. English commas are not allowed.',
    invalidSize: 'Upload file size cannot exceed {size} MB.',
    uploading: 'Uploading file, please wait...',
    limitExceeded: 'The number of uploaded files cannot exceed {limit}.',
    failed: 'File upload failed',
    responseError: 'Upload response error: {message}',
    unknownResponseError: 'Unknown response parsing error',
    imageInsertFailed: 'Failed to insert image',
    imageUploadFailed: 'Image upload failed',
    videoUploadFailed: 'Video upload failed',
    preview: 'Preview',
    imageInvalidType: 'Invalid file format. Please upload {types} image files.',
    imageInvalidSize: 'Avatar image size cannot exceed {size} MB.',
    imageUploading: 'Uploading image, please wait...',
    imageResponseError: 'Image upload response error: {message}',
    imageFailed: 'Image upload failed',
    videoInvalidType: 'Invalid video format. Please upload {types} files.',
    videoInvalidSize: 'Video size cannot exceed {size} MB.',
    videoUploading: 'Uploading video, please wait...',
    editorPlaceholder: 'Enter content'
  },
  table: {
    collapseRow: 'Collapse',
    expandRow: 'Expand',
    expandingRootLevel: 'Expanding root level',
    loadFailed: 'Load failed',
    loadingChildren: 'Loading child nodes',
    selectAll: 'Select all',
    selectRow: 'Select row {index}',
    totalSelected: '{total} records, {selected} selected.'
  },
  toolGen: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Code Generator',
    listTitle: 'Data Tables',
    listSummary:
      '{total} records. Supports importing table structures, synchronizing databases, previewing code, and generating code.',
    emptyText: 'No data tables',
    previewTitle: 'Code Preview',
    copy: 'Copy',
    copySuccess: 'Copied successfully',
    selectGenerateData: 'Select data to generate',
    customPathSuccess: 'Generated to custom path: {path}',
    selectSyncData: 'Select data to synchronize',
    syncConfirm: 'Are you sure you want to force synchronize table structure "{name}"?',
    syncSuccess: 'Synchronized successfully',
    deleteConfirm: 'Are you sure you want to delete table ID "{ids}"?',
    importTitle: 'Import Tables',
    importEmptyText: 'No importable tables',
    selectImportTable: 'Select tables to import',
    restoreDefaultPath: 'Restore Default Path',
    validationFailed: 'Form validation failed. Check the submitted content again.',
    valuePair: '{name}: {comment}',
    action: {
      generate: 'Generate',
      preview: 'Preview',
      sync: 'Sync',
      generateCode: 'Generate Code'
    },
    tab: {
      basicInfo: 'Basic Info',
      columnInfo: 'Column Info',
      genInfo: 'Generation Info'
    },
    section: {
      otherInfo: 'Other Info',
      relationInfo: 'Relation Info'
    },
    field: {
      tableName: 'Table Name',
      tableComment: 'Table Description',
      createTime: 'Created At',
      updateTime: 'Updated At',
      entity: 'Entity',
      className: 'Entity Class Name',
      functionAuthor: 'Author',
      columnName: 'Column Name',
      columnComment: 'Column Description',
      columnType: 'Physical Type',
      netType: '.Net Type',
      netField: '.Net Property',
      isInsert: 'Insert',
      isEdit: 'Edit',
      isList: 'List',
      isQuery: 'Query',
      queryType: 'Query Type',
      isRequired: 'Required',
      htmlType: 'Display Type',
      dictType: 'Dictionary Type',
      tplCategory: 'Template',
      packageName: 'Package Path',
      moduleName: 'Module Name',
      businessName: 'Business Name',
      functionName: 'Function Name',
      parentMenuId: 'Parent Menu',
      genType: 'Code Generation Mode',
      genPath: 'Custom Path',
      treeCode: 'Tree Code Field',
      treeParentCode: 'Tree Parent Code Field',
      treeName: 'Tree Name Field',
      subTableName: 'Related Subtable Name',
      subTableFkName: 'Subtable Foreign Key Name'
    },
    placeholder: {
      tableName: 'Enter table name',
      tableComment: 'Enter table description',
      className: 'Enter entity class name',
      functionAuthor: 'Enter author',
      genericInput: 'Enter value',
      select: 'Select',
      parentMenuId: 'Select system menu'
    },
    rule: {
      tableName: 'Enter table name',
      tableComment: 'Enter table description',
      className: 'Enter entity class name',
      functionAuthor: 'Enter author',
      tplCategory: 'Select generation template',
      packageName: 'Enter package path',
      moduleName: 'Enter module name',
      businessName: 'Enter business name',
      functionName: 'Enter function name'
    },
    templateCategory: {
      crud: 'Single Table (CRUD)',
      tree: 'Tree Table (CRUD)',
      sub: 'Master-Detail Table (CRUD)'
    },
    genType: {
      zip: 'ZIP Package',
      customPath: 'Custom Path'
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
      packageName: 'The package to generate into, such as RuoYi.System',
      moduleName: 'Can be understood as the subsystem name, such as system',
      businessName: 'Can be understood as the feature English name, such as user',
      functionName: 'Used as the class description, such as User',
      parentMenuId: 'Assign under a specific menu, such as System Management',
      genType: 'Download as a ZIP package by default, or generate to a custom path',
      genPath: 'Enter an absolute disk path. If empty, files are generated under the current web project.',
      treeCode: 'Code field name displayed in the tree, such as dept_id',
      treeParentCode: 'Parent code field name displayed in the tree, such as parent_id',
      treeName: 'Display name field for tree nodes, such as dept_name',
      subTableName: 'Related subtable name, such as sys_user',
      subTableFkName: 'Foreign key name of the related subtable, such as user_id'
    },
    htmlType: {
      input: 'Text Input',
      textarea: 'Textarea',
      select: 'Select',
      radio: 'Radio',
      checkbox: 'Checkbox',
      datetime: 'Date Picker',
      imageUpload: 'Image Upload',
      fileUpload: 'File Upload',
      editor: 'Rich Text Editor'
    }
  },
  workspace: {
    recent: 'Recent',
    collapse: 'Collapse',
    favorite: 'Favorites',
    done: 'Done',
    edit: 'Edit',
    allApps: 'All Apps',
    allCategory: 'All',
    uncategorized: 'Uncategorized',
    unnamedApp: 'Unnamed App',
    noVisitRecord: 'No visit records',
    emptyRecentTitle: 'No recent visits',
    emptyRecentDescription: 'Open any app and your frequent entries will appear here.',
    emptyFavoriteTitle: 'No favorite apps',
    emptyFavoriteDescription: 'Favorite commonly used systems to keep your workspace clean and close at hand.',
    emptySearchTitle: 'No matching apps',
    emptySearchDescription: 'Switch categories or wait for the backend to return accessible apps.',
    applicationLoadFailed: 'Failed to load workspace app data: {message}',
    launchFailed: 'Failed to enter app: {message}',
    authorizeUrlMissing: 'App {name} does not have authorizeUrl configured and cannot be opened',
    applicationTotal: 'Total Apps',
    currentAccessible: 'Currently Accessible',
    online: 'Online',
    fromApplicationList: 'From app list',
    todayVisits: 'Visits Today',
    countedByVisitRecords: 'Counted by visit records',
    pendingReview: 'Pending Review',
    pendingApiStatus: 'API status pending'
  },
  applicationCenter: {
    aria: 'App Center',
    title: 'App Center',
    categoryFilterAria: 'App category filters',
    emptyTitle: 'No matching apps',
    emptyDescription: 'Switch categories or wait for the backend to return accessible apps.',
    detailTitle: 'App Details',
    closeDetail: 'Close app details',
    enter: 'Enter App',
    category: 'Category',
    permission: 'Permission',
    lastUsed: 'Last Used',
    authorized: 'Authorized',
    unavailable: 'Unavailable',
    favorite: 'Favorite {name}',
    unfavorite: 'Remove favorite {name}',
    loadFailed: 'Failed to load app center data: {message}',
    favoriteUpdateFailed: 'Failed to update favorite status: {message}',
    launchFailed: 'Failed to enter app: {message}',
    selectApplicationRequired: 'No app selected to enter'
  },
  applicationSwitch: {
    aria: 'Application switch',
    searchAria: 'Search apps',
    searchPlaceholder: 'Search applications...',
    clearSearch: 'Clear search',
    more: 'More',
    backHome: 'Back to Home',
    openUserMenu: 'Open user menu',
    categoryMoreAria: 'Show more app categories',
    recentRegion: 'Recently used applications',
    allRegion: 'All applications',
    loadingStatus: 'Loading',
    resultCount: '{count} apps',
    errorRetry: 'Retry',
    launchingGeneric: 'app',
    launchingApp: 'Opening {name}',
    launchingDescription: 'Recording the visit and preparing authorization. Please wait.',
    navigatingHome: 'Returning to home',
    navigatingHomeDescription: 'Leaving the quick switcher and returning to the project home.',
    loggingOut: 'Logging out',
    loggingOutDescription: 'Clearing the current session and returning to sign in.',
    emptyRecentDescription: 'Recently used entries will appear here after you open apps.',
    loadFailed: 'Failed to load application switch data: {message}',
    launchFailed: 'Failed to enter app: {message}'
  },
  ssoApplication: {
    title: 'OAuth App Management',
    create: 'Create App',
    searchAppNamePlaceholder: 'Enter app name',
    searchAppKeyPlaceholder: 'Enter AppKey',
    selectCategoryPlaceholder: 'Select app category',
    selectGrantTypePlaceholder: 'Select grant type',
    selectStatusPlaceholder: 'Select status',
    emptyText: 'No OAuth apps',
    generatedAfterCreate: 'Shown after system generation',
    copySecret: 'Copy app secret',
    status: {
      online: 'Online',
      reviewing: 'In Review',
      offline: 'Offline',
      draft: 'Draft'
    },
    field: {
      appName: 'App Name',
      appKey: 'AppKey',
      appId: 'AppId',
      appSecret: 'App Secret',
      appCategory: 'App Category',
      grantType: 'Grant Type',
      status: 'Status',
      callbackUrl: 'Callback URL',
      resignationCallbackUrl: 'Resignation Callback URL',
      appIcon: 'App Icon',
      appDescription: 'App Description',
      remark: 'Remark',
      authSources: 'Auth Sources',
      appInfo: 'App Info',
      createTime: 'Created At'
    },
    placeholder: {
      appName: 'Enter app name',
      callbackUrl: 'Enter authorization callback URL',
      resignationCallbackUrl: 'Enter resignation callback URL',
      appDescription: 'Enter app description',
      remark: 'Enter remark'
    },
    rule: {
      appName: 'App name is required',
      grantType: 'Grant type is required',
      status: 'Status is required',
      callbackUrl: 'Callback URL is required'
    },
    dialog: {
      create: 'Create OAuth App',
      edit: 'Edit OAuth App'
    },
    action: {
      edit: 'Edit',
      delete: 'Delete'
    },
    detailInvalid: 'Invalid app detail structure',
    copySuccess: 'Copied successfully',
    copyFailed: 'Copy failed: {message}',
    deleteConfirm: 'Are you sure you want to delete app item "{ids}"?',
    deleteSuccess: 'Deleted successfully'
  },
  systemUser: {
    deptTreeTitle: 'Department Tree',
    deptTreePlaceholder: 'Enter department name',
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'User Dataset',
    listTitle: 'Users',
    listSummary: '{total} records. Supports department filtering, status changes, import/export, and role assignment.',
    emptyText: 'No user data',
    downloadTemplate: 'Download Template',
    importData: 'Import Data',
    exportData: 'Export Data',
    importTitle: 'Import Users',
    importDropText: 'Drop file here, or',
    importClickUpload: 'click to upload',
    importUpdateExisting: 'Update existing user data',
    importFileTip: 'Only xls and xlsx files are allowed.',
    importResultTitle: 'Import Result',
    resetPasswordPrompt: 'Enter a new password for "{name}"',
    resetPasswordTitle: 'Notice',
    resetPasswordSuccess: 'Updated successfully. New password: {password}',
    protectedDeleteWarning: 'The super administrator account cannot be deleted',
    protectedDisableWarning: 'The super administrator account cannot be disabled',
    protectedAssignRoleWarning: 'The super administrator account cannot be assigned roles',
    protectedResetPasswordWarning: 'The super administrator password cannot be reset',
    protectedEditWarning: 'The super administrator account cannot be edited',
    selectAssignRoleUser: 'Select a user to assign roles',
    selectEditUser: 'Select a user to edit',
    deleteConfirm: 'Are you sure you want to delete user item "{ids}"?',
    statusConfirm: 'Are you sure you want to {action} user "{name}"?',
    statusSuccess: '{action} successful',
    enable: 'Enable',
    disable: 'Disable',
    userType: {
      system: 'System User',
      domain: 'Domain Account'
    },
    dialog: {
      create: 'Add User',
      edit: 'Edit User'
    },
    field: {
      userId: 'User ID',
      userName: 'Employee No.',
      nickName: 'Name',
      deptName: 'Department',
      dept: 'Department',
      phonenumber: 'Mobile',
      email: 'Email',
      loginAccount: 'Login Account',
      userType: 'User Type',
      status: 'Status',
      userStatus: 'User Status',
      createTime: 'Created At',
      updateTime: 'Updated At',
      loginIp: 'Last Login IP',
      loginDate: 'Last Login Time',
      remark: 'Remark',
      password: 'Password',
      sex: 'Gender',
      post: 'Post',
      role: 'Role'
    },
    placeholder: {
      userName: 'Enter employee number',
      nickName: 'Enter name',
      phonenumber: 'Enter mobile number',
      status: 'User status',
      userType: 'Select user type',
      dept: 'Select department',
      email: 'Enter email',
      password: 'Enter password',
      sex: 'Select',
      post: 'Select posts',
      role: 'Select roles',
      remark: 'Enter content'
    },
    rule: {
      userNameRequired: 'Employee number is required',
      userNameLength: 'Employee number length must be between 2 and 20 characters',
      nickNameRequired: 'Name is required',
      passwordRequired: 'Password is required',
      passwordLength: 'Password length must be between 5 and 20 characters',
      passwordLengthShort: 'Length must be between 6 and 20 characters',
      illegalCharacters:
        'Cannot contain illegal characters: less-than sign, greater-than sign, double quote, single quote, backslash, or vertical bar',
      emailRequired: 'Email is required',
      emailInvalid: 'Enter a valid email address',
      phoneRequired: 'Mobile number is required',
      phoneInvalid: 'Enter a valid mobile number',
      roleRequired: 'User role is required'
    },
    action: {
      resetPassword: 'Reset Password',
      assignRole: 'Assign Roles'
    },
    authRole: {
      basicInfo: 'Basic Info',
      roleInfo: 'Role Info',
      selectedSummary: 'Selected Roles ({total})',
      noSelectedRoles: 'No roles selected',
      showMoreSelected: 'Show More',
      collapseSelected: 'Collapse',
      emptyRoles: 'No role data',
      grantSuccess: 'Authorization updated successfully',
      index: 'No.',
      roleId: 'Role ID',
      roleName: 'Role Name',
      roleKey: 'Permission Key'
    },
    detail: {
      title: 'User Details'
    }
  },
  systemPost: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Post Dataset',
    listTitle: 'Posts',
    listSummary: '{total} records. Supports post maintenance and export.',
    emptyText: 'No post data',
    deleteConfirm: 'Are you sure you want to delete post item "{ids}"?',
    deleteSuccess: 'Deleted successfully',
    dialog: {
      create: 'Add Post',
      edit: 'Edit Post'
    },
    field: {
      postId: 'Post ID',
      postCode: 'Post Code',
      postName: 'Post Name',
      postSort: 'Post Order',
      postSortOrder: 'Post Order',
      postStatus: 'Post Status',
      status: 'Status',
      createTime: 'Created At',
      remark: 'Remark'
    },
    placeholder: {
      postCode: 'Enter post code',
      postName: 'Enter post name',
      status: 'Post status',
      remark: 'Enter content'
    },
    rule: {
      postName: 'Post name is required',
      postCode: 'Post code is required',
      postSort: 'Post order is required'
    }
  },
  systemConfig: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Config Dataset',
    listTitle: 'Config',
    listSummary: '{total} records. Supports key-value maintenance, export, and cache refresh.',
    emptyText: 'No config data',
    refreshCache: 'Refresh Cache',
    refreshCacheSuccess: 'Cache refreshed successfully',
    deleteConfirm: 'Are you sure you want to delete config item "{ids}"?',
    deleteSuccess: 'Deleted successfully',
    dialog: {
      create: 'Add Config',
      edit: 'Edit Config'
    },
    field: {
      configName: 'Config Name',
      configKey: 'Config Key',
      configValue: 'Config Value',
      configType: 'Built-in',
      remark: 'Remark',
      createTime: 'Created At'
    },
    placeholder: {
      configName: 'Enter config name',
      configKey: 'Enter config key',
      configValue: 'Enter config value',
      remark: 'Enter content'
    },
    rule: {
      configName: 'Config name is required',
      configKey: 'Config key is required',
      configValue: 'Config value is required'
    }
  },
  systemDept: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Department Dataset',
    listTitle: 'Departments',
    listSummary: 'Supports tree hierarchy maintenance, owner binding, and department status management.',
    emptyText: 'No department data',
    syncDept: 'Sync Departments',
    syncDomainUsers: 'Sync Domain Users',
    syncDeptConfirm: 'Are you sure you want to sync department data from the AD organization structure?',
    syncDeptSuccess: 'Departments synced successfully',
    selectSyncDept: 'Select a department to sync',
    syncDomainUsersConfirm: 'Are you sure you want to sync domain users under department "{name}"?',
    syncDomainUsersSuccess: 'Domain users synced successfully',
    deleteConfirm: 'Are you sure you want to delete data item named "{name}"?',
    deleteSuccess: 'Deleted successfully',
    userSettings: {
      action: 'Set Admins and Default Role',
      title: 'Set Admins and Default Role for "{name}"',
      managerTab: 'Admin Settings',
      defaultRoleTab: 'Default Role Settings',
      currentDept: 'Current Department:',
      currentDeptLabel: 'Current Department',
      defaultRole: 'Default Role',
      defaultRolePlaceholder: 'Select default role',
      managerTitle: 'Department Admins',
      managerSummary: 'Selected Admins ({total}/10)',
      managerNotice: 'Admins manage this department and its members. Up to 10 admins can be set.',
      managerLimitWarning: 'At most {max} department admins can be set.',
      clearManagers: 'Clear',
      noManagers: 'No department admins',
      availableUsers: 'Available Users',
      userNameOrName: 'Username/Name',
      userNameOrNamePlaceholder: 'Enter username or name',
      currentDeptUsers: 'Current Department Users',
      otherDeptUsers: 'Search Other Department Users',
      setManager: 'Set as Admin',
      cancelManager: 'Remove Admin',
      noCurrentDeptUsers: 'No users in this department',
      otherSearchHint: 'Enter username or nickname to search users in other departments',
      otherSearchRequired: 'Enter username or nickname before searching',
      noOtherUsers: 'No matching users from other departments',
      defaultRoleNotice:
        'When new members join this department, the selected default role will be assigned automatically.',
      selectedRoleInfo: 'Selected Role Info',
      selectedRoleEmptyTitle: 'No default role selected',
      selectedRoleEmptyDesc: 'The selected role will become the default role for new members.',
      selectedRoleReadyTitle: 'Selected default role: {role}',
      selectedRoleReadyDesc:
        'After saving, this role will be used as the default role for new members of the current department.',
      saveSuccess: 'Department user settings saved'
    },
    dialog: {
      create: 'Add Department',
      edit: 'Edit Department'
    },
    field: {
      parentDept: 'Parent Department',
      deptName: 'Department Name',
      orderNum: 'Order',
      displayOrder: 'Display Order',
      leader: 'Owner',
      phone: 'Phone',
      email: 'Email',
      status: 'Status',
      deptStatus: 'Department Status',
      createTime: 'Created At'
    },
    placeholder: {
      parentDept: 'Select parent department',
      deptName: 'Enter department name',
      status: 'Department status',
      leader: 'Enter owner',
      phone: 'Enter phone number',
      email: 'Enter email'
    },
    rule: {
      parentId: 'Parent department is required',
      deptName: 'Department name is required',
      orderNum: 'Display order is required',
      email: 'Enter a valid email address',
      phone: 'Enter a valid mobile number'
    }
  },
  systemMenu: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Menu Dataset',
    listTitle: 'Menus',
    listSummary: 'Supports tree loading, icon selection, and directory/menu/button maintenance.',
    emptyText: 'No menu data',
    importTitle: 'Import Menus',
    importPickFile: 'Select File',
    importFileTip: 'Only xls and xlsx files are allowed.',
    importSuccess: 'Imported successfully',
    topCategory: 'Root Category',
    deleteConfirm: 'Are you sure you want to delete data item named "{name}"?',
    deleteSuccess: 'Deleted successfully',
    dialog: {
      create: 'Add Menu',
      edit: 'Edit Menu'
    },
    type: {
      directory: 'Directory',
      menu: 'Menu',
      button: 'Button',
      externalLink: 'External Link'
    },
    cache: {
      cache: 'Cache',
      noCache: 'No Cache'
    },
    field: {
      app: 'Application',
      parentMenu: 'Parent Menu',
      menuType: 'Menu Type',
      icon: 'Menu Icon',
      menuName: 'Menu Name',
      menuCode: 'Code',
      displayOrder: 'Display Order',
      orderNum: 'Order',
      isFrame: 'External Link',
      path: 'Route Path',
      component: 'Component Path',
      permission: 'Permission',
      query: 'Route Query',
      isCache: 'Cache',
      visible: 'Visibility',
      status: 'Status',
      menuStatus: 'Menu Status',
      activeMenu: 'Active Route',
      remark: 'Remark',
      uploadFile: 'Upload File',
      type: 'Type'
    },
    placeholder: {
      app: 'Select application',
      parentMenu: 'Select parent menu',
      menuName: 'Enter menu name',
      menuCode: 'Enter code',
      status: 'Menu status',
      path: 'Enter route path',
      component: 'Enter component path',
      permission: 'Enter permission key',
      query: 'Enter route query',
      activeMenu: 'Enter active route',
      remark: 'Enter remark'
    },
    tooltip: {
      isFrame: 'If this is an external link, the route path must start with http(s)://',
      path: 'Route path, for example user. For an external URL used as an internal link, start with http(s)://',
      component: 'Component path, for example system/user/index. The default root is the views directory',
      permission: "Permission key defined in the controller, for example SaCheckPermission('system:user:list')",
      query: 'Default route query parameters, for example id=1 and name=ry',
      isCache: 'When enabled, keep-alive caches the page. The component name must match the route path',
      visible: 'When hidden, the route will not appear in the sidebar but can still be accessed',
      status: 'When disabled, the route will not appear in the sidebar and cannot be accessed',
      activeMenu: 'For hidden menus, enter the default active route, such as /system/user'
    },
    rule: {
      app: 'Application is required',
      importFile: 'Select a file to import',
      menuName: 'Menu name is required',
      orderNum: 'Menu order is required',
      path: 'Route path is required'
    }
  },
  systemNotice: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Notice Dataset',
    listTitle: 'Notices',
    listSummary: '{total} records. Supports type filtering, content editing, and status management.',
    emptyText: 'No notice data',
    emptyContent: 'No notice content',
    detailTitle: 'Notice Details',
    deleteConfirm: 'Are you sure you want to delete notice item "{ids}"?',
    deleteSuccess: 'Deleted successfully',
    dialog: {
      create: 'Add Notice',
      edit: 'Edit Notice'
    },
    detail: {
      type: 'Type: ',
      status: 'Status: ',
      creator: 'Creator: ',
      createTime: 'Created At: '
    },
    field: {
      noticeTitle: 'Notice Title',
      operator: 'Operator',
      type: 'Type',
      noticeType: 'Notice Type',
      status: 'Status',
      creator: 'Creator',
      createTime: 'Created At',
      content: 'Content'
    },
    placeholder: {
      noticeTitle: 'Enter notice title',
      operator: 'Enter operator',
      type: 'Notice type',
      select: 'Select'
    },
    rule: {
      noticeTitle: 'Notice title is required',
      noticeType: 'Notice type is required'
    }
  },
  systemDict: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Dictionary Dataset',
    listTitle: 'Dictionaries',
    listSummary: '{total} records. Click "Dictionary Data" to open the corresponding dictionary data.',
    emptyText: 'No dictionary type data',
    refreshCache: 'Refresh Cache',
    refreshSuccess: 'Refreshed successfully',
    deleteConfirm: 'Are you sure you want to delete dictionary item "{ids}"?',
    deleteSuccess: 'Deleted successfully',
    dialog: {
      create: 'Add Dictionary Type',
      edit: 'Edit Dictionary Type'
    },
    action: {
      data: 'Dictionary Data'
    },
    field: {
      dictId: 'Dictionary ID',
      dictName: 'Dictionary Name',
      dictType: 'Dictionary Type',
      status: 'Status',
      remark: 'Remark',
      createTime: 'Created At'
    },
    placeholder: {
      dictName: 'Enter dictionary name',
      dictType: 'Enter dictionary type',
      status: 'Dictionary status',
      remark: 'Enter content'
    },
    rule: {
      dictName: 'Dictionary name is required',
      dictType: 'Dictionary type is required'
    }
  },
  systemDictData: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Dictionary Data',
    listTitle: 'Dictionary Data',
    listSummary: '{summary}, {total} records.',
    loadingSummary: 'Loading dictionary type',
    emptyText: 'No dictionary data',
    missingDictId: 'Missing dictionary ID. Unable to load dictionary data',
    selectDictTypeFirst: 'Select a dictionary type first',
    deleteConfirm: 'Are you sure you want to delete dictionary data item "{ids}"?',
    deleteSuccess: 'Deleted successfully',
    dialog: {
      create: 'Add Dictionary Data',
      edit: 'Edit Dictionary Data'
    },
    listClass: {
      default: 'Default (default)',
      primary: 'Primary (primary)',
      success: 'Success (success)',
      info: 'Info (info)',
      warning: 'Warning (warning)',
      danger: 'Danger (danger)'
    },
    field: {
      dictCode: 'Dictionary Code',
      dictType: 'Dictionary Type',
      dictLabel: 'Data Label',
      dictValue: 'Data Value',
      dictSort: 'Dictionary Order',
      displayOrder: 'Display Order',
      cssClass: 'CSS Class',
      listClass: 'Display Style',
      status: 'Status',
      remark: 'Remark',
      createTime: 'Created At'
    },
    placeholder: {
      dictLabel: 'Enter dictionary label',
      dataLabel: 'Enter data label',
      dataValue: 'Enter data value',
      cssClass: 'Enter CSS class',
      remark: 'Enter content',
      status: 'Data status'
    },
    rule: {
      dictLabel: 'Data label is required',
      dictValue: 'Data value is required',
      dictSort: 'Data order is required'
    }
  },
  systemRole: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Role Dataset',
    listTitle: 'Roles',
    listSummary: '{total} records. Supports menu permissions, data permissions, and user assignment workflows.',
    emptyText: 'No role data',
    deleteConfirm: 'Are you sure you want to delete role item "{ids}"?',
    deleteSuccess: 'Deleted successfully',
    statusChangeConfirm: 'Are you sure you want to {action} role "{name}"?',
    statusChangeSuccess: '{action} succeeded',
    permissionUpdateSuccess: 'Updated successfully',
    dataScope: {
      all: 'All data permissions',
      custom: 'Custom data permissions',
      dept: 'Current department data',
      deptAndChildren: 'Current department and child data',
      self: 'Own data only'
    },
    dialog: {
      create: 'Add Role',
      edit: 'Edit Role',
      assignPermission: 'Assign Permissions'
    },
    action: {
      assignPermission: 'Assign Permissions',
      assignUser: 'Assign Users'
    },
    field: {
      roleName: 'Role Name',
      roleKey: 'Permission Key',
      roleSort: 'Role Order',
      dept: 'Visible Departments',
      displayOrder: 'Display Order',
      status: 'Status',
      createTime: 'Created At',
      remark: 'Remark'
    },
    placeholder: {
      roleName: 'Enter role name',
      roleKey: 'Enter permission key',
      dept: 'Select visible departments',
      status: 'Role status',
      startDate: 'Start date',
      endDate: 'End date',
      remark: 'Enter content'
    },
    rule: {
      roleName: 'Role name is required',
      roleKey: 'Permission key is required',
      roleSort: 'Role order is required'
    },
    tooltip: {
      roleKey: "Permission key defined in the controller, for example SaCheckRole('admin')"
    },
    protectedAdmin: {
      delete: 'The super administrator role cannot be deleted',
      disable: 'The super administrator role cannot be disabled',
      assignUser: 'Users cannot be assigned to the super administrator role',
      edit: 'The super administrator role cannot be edited',
      assignPermission: 'Permissions cannot be assigned to the super administrator role'
    },
    statusAction: {
      enable: 'enable',
      disable: 'disable'
    }
  },
  systemRolePermission: {
    tab: {
      menu: 'Menu Permissions',
      data: 'Data Permissions'
    },
    toggle: {
      expand: 'Expand / Collapse',
      selectAll: 'Select All / None',
      parentChild: 'Parent-Child Link'
    },
    header: {
      menuName: 'Menu Name',
      buttonPermission: 'Button Permissions'
    },
    loading: 'Loading, please wait',
    emptyMenu: 'No menus',
    status: {
      hidden: 'Hidden',
      disabled: 'Disabled'
    },
    field: {
      permissionScope: 'Permission Scope',
      dataPermission: 'Data Permissions'
    }
  },
  systemRoleAuthUser: {
    filterTitle: 'Filters',
    listTitle: 'Authorized Users',
    emptyText: 'No authorized users',
    action: {
      addUser: 'Add User',
      cancelBatch: 'Cancel Authorization',
      cancelAuth: 'Cancel Authorization'
    },
    field: {
      userName: 'Username',
      nickName: 'Nickname',
      email: 'Email',
      phone: 'Mobile',
      phonenumber: 'Mobile Number',
      status: 'Status',
      createTime: 'Created At'
    },
    placeholder: {
      userName: 'Enter username',
      phonenumber: 'Enter mobile number'
    },
    cancelConfirm: 'Are you sure you want to cancel the role authorization for user "{name}"?',
    cancelBatchConfirm: 'Cancel authorization for the selected users?',
    cancelSuccess: 'Authorization cancelled successfully'
  },
  systemRoleSelectUser: {
    title: 'Select Users',
    emptyText: 'No assignable users',
    selectRequired: 'Select users to assign',
    assignSuccess: 'Assigned successfully'
  },
  monitorDruid: {
    title: 'Notice',
    subtitle: 'The data monitoring page is still being completed.',
    backHome: 'Back to Home'
  },
  monitorOnline: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Online Sessions',
    listTitle: 'Online Users',
    listSummary: '{total} records. Search by account or address and force sessions offline.',
    emptyText: 'No online user data',
    forceLogoutConfirm: 'Are you sure you want to force user "{name}" offline?',
    forceLogoutSuccess: 'Forced offline successfully',
    action: {
      forceLogout: 'Force Offline'
    },
    field: {
      index: 'No.',
      tokenId: 'Session ID',
      userName: 'Username',
      loginName: 'Login Name',
      deptName: 'Department',
      loginAddress: 'Login Address',
      host: 'Host',
      loginLocation: 'Login Location',
      os: 'Operating System',
      browser: 'Browser',
      loginTime: 'Login Time'
    },
    placeholder: {
      ipaddr: 'Enter login address',
      userName: 'Enter username'
    }
  },
  monitorCache: {
    overviewTitle: 'Cache Overview',
    overviewSummary: 'Redis runtime status, resource usage, and real-time statistics.',
    commandStatsTitle: 'Command Statistics',
    memoryInfoTitle: 'Memory Information',
    loading: 'Loading cache monitoring data. Please wait.',
    chartContainerMissing: 'Cache monitoring chart containers are not mounted, so ECharts cannot be initialized.',
    field: {
      redisVersion: 'Redis Version',
      runMode: 'Run Mode',
      port: 'Port',
      clients: 'Clients',
      uptimeDays: 'Uptime (Days)',
      usedMemory: 'Used Memory',
      usedCpu: 'Used CPU',
      memoryConfig: 'Memory Config',
      aofEnabled: 'AOF Enabled',
      rdbSuccess: 'RDB Successful',
      keyCount: 'Key Count',
      networkIo: 'Network In/Out'
    },
    value: {
      standalone: 'Standalone',
      cluster: 'Cluster'
    },
    chart: {
      command: 'Command',
      peak: 'Peak',
      memoryUsage: 'Memory Usage'
    }
  },
  monitorCacheList: {
    cacheNameTitle: 'Cache List',
    cacheKeyTitle: 'Key List',
    cacheContentTitle: 'Cache Content',
    field: {
      cacheName: 'Cache Name',
      cacheKey: 'Cache Key',
      cacheValue: 'Cache Value'
    },
    empty: {
      cacheNames: 'No cache data',
      cacheKeys: 'No cache keys'
    },
    action: {
      clear: 'Clear',
      clearAll: 'Clear All',
      refreshCacheNames: 'Refresh cache list',
      refreshCacheKeys: 'Refresh key list'
    },
    message: {
      refreshCacheNamesSuccess: 'Cache list refreshed successfully',
      refreshCacheKeysSuccess: 'Key list refreshed successfully',
      clearCacheNameSuccess: 'Cache name [{name}] cleared successfully',
      clearCacheKeySuccess: 'Cache key [{key}] cleared successfully',
      clearAllConfirm: 'Are you sure you want to clear all cache?',
      clearAllSuccess: 'All cache cleared successfully'
    }
  },
  monitorServer: {
    memoryTitle: 'Memory',
    serverInfoTitle: 'Server Information',
    clrInfoTitle: '.NET CLR Information',
    diskTitle: 'Disk Status',
    empty: {
      memory: 'No memory data',
      disk: 'No disk data'
    },
    value: {
      noData: 'N/A'
    },
    memory: {
      total: 'Total Memory',
      used: 'Used Memory',
      free: 'Free Memory',
      usage: 'Usage'
    },
    field: {
      cpuNum: 'Cores',
      cpuTotal: 'Usage',
      cpuUsed: 'User Usage',
      cpuSys: 'System Usage',
      cpuFree: 'Idle',
      computerName: 'Server Name',
      osName: 'Operating System',
      computerIp: 'Server IP',
      osArch: 'System Architecture',
      clrName: '.NET Name',
      clrVersion: '.NET Version',
      startTime: 'Start Time',
      runTime: 'Run Time',
      home: 'Install Path',
      userDir: 'Project Path',
      inputArgs: 'Run Parameters',
      property: 'Property',
      dirName: 'Drive Path',
      sysTypeName: 'File System',
      typeName: 'Drive Type',
      total: 'Total Size',
      free: 'Available Size',
      used: 'Used Size',
      usage: 'Used %'
    }
  },
  monitorLoginInfo: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Access Logs',
    listTitle: 'Login Logs',
    listSummary: '{total} records. Supports sorting, batch cleanup, export, and account unlock.',
    emptyText: 'No login log data',
    deleteConfirm: 'Are you sure you want to delete access ID "{ids}"?',
    cleanConfirm: 'Are you sure you want to clear all login log records?',
    cleanSuccess: 'Cleared successfully',
    unlockConfirm: 'Are you sure you want to unlock user "{name}"?',
    unlockSuccess: 'User {name} unlocked successfully',
    action: {
      unlock: 'Unlock'
    },
    field: {
      infoId: 'Access ID',
      userName: 'Username',
      ipaddr: 'Login Address',
      address: 'Address',
      loginLocation: 'Login Location',
      os: 'Operating System',
      browser: 'Browser',
      status: 'Login Status',
      msg: 'Description',
      loginTime: 'Login Time',
      accessTime: 'Access Time'
    },
    placeholder: {
      ipaddr: 'Enter login address',
      userName: 'Enter username',
      status: 'Login status'
    }
  },
  monitorOperlog: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Operation Logs',
    listTitle: 'Operation Logs',
    listSummary: '{total} records. Supports type filters, detail view, batch cleanup, and export.',
    emptyText: 'No operation log data',
    detailTitle: 'Operation Log Details',
    deleteConfirm: 'Are you sure you want to delete log ID "{ids}"?',
    cleanConfirm: 'Are you sure you want to clear all operation log records?',
    cleanSuccess: 'Cleared successfully',
    costTimeValue: '{value} ms',
    status: {
      normal: 'Normal',
      failed: 'Failed'
    },
    field: {
      operId: 'Log ID',
      title: 'System Module',
      operName: 'Operator',
      operIp: 'Operation Address',
      type: 'Type',
      businessType: 'Operation Type',
      status: 'Operation Status',
      operTime: 'Operation Time',
      operDate: 'Operation Date',
      deptName: 'Department',
      costTime: 'Cost Time'
    },
    placeholder: {
      operIp: 'Enter operation address',
      title: 'Enter system module',
      operName: 'Enter operator',
      businessType: 'Operation type',
      status: 'Operation status'
    },
    detail: {
      status: 'Operation Status',
      loginInfo: 'Login Info',
      requestInfo: 'Request Info',
      operationModule: 'Operation Module',
      operationMethod: 'Operation Method',
      requestParams: 'Request Parameters',
      responseParams: 'Response Parameters',
      costTime: 'Cost Time',
      operationTime: 'Operation Time',
      errorInfo: 'Error Info'
    }
  },
  monitorJob: {
    searchKicker: 'Search Filters',
    filterTitle: 'Filters',
    listKicker: 'Scheduler Jobs',
    listTitle: 'Scheduled Jobs',
    listSummary: '{total} records. Supports job maintenance, start/stop, immediate runs, and scheduler log review.',
    emptyText: 'No scheduled job data',
    logEmptyText: 'No scheduler log data',
    detailTitle: 'Job Details',
    logTitle: 'Scheduler Logs',
    logDetailTitle: 'Scheduler Log Details',
    enabledEditBlocked:
      'Running scheduled jobs cannot be edited directly. Disable the job before changing its configuration.',
    cronInvalid: 'Invalid Cron expression',
    deleteConfirm: 'Are you sure you want to delete scheduled job ID "{ids}"?',
    statusConfirm: 'Are you sure you want to {action} job "{name}"?',
    statusSuccess: '{action} succeeded',
    runConfirm: 'Are you sure you want to run job "{name}" once now?',
    runSuccess: 'Run completed successfully',
    logDetailMissing: 'The scheduler log detail API did not return data',
    logDeleteConfirm: 'Are you sure you want to delete scheduler log ID "{ids}"?',
    logCleanConfirm: 'Are you sure you want to clear all scheduler log records?',
    logCleanSuccess: 'Cleared successfully',
    action: {
      log: 'Logs',
      runOnce: 'Run Once',
      enable: 'enable',
      disable: 'disable'
    },
    form: {
      addTitle: 'Add Job',
      editTitle: 'Edit Job'
    },
    field: {
      jobId: 'Job ID',
      jobName: 'Job Name',
      jobGroupName: 'Job Group Name',
      jobGroup: 'Job Group',
      createTime: 'Created At',
      cronExpression: 'Cron Expression',
      cronExecuteExpression: 'Cron Execution Expression',
      nextValidTime: 'Next Run Time',
      invokeTarget: 'Invoke Target Method',
      invokeMethod: 'Invoke Method',
      jobStatus: 'Job Status',
      concurrent: 'Concurrent',
      misfirePolicy: 'Misfire Policy',
      executionStatus: 'Execution Status',
      executionTime: 'Execution Time',
      jobLogId: 'Log ID',
      jobMessage: 'Log Message',
      exceptionInfo: 'Exception Info'
    },
    placeholder: {
      jobName: 'Enter job name',
      jobGroupName: 'Select job group name',
      jobGroup: 'Select job group',
      jobStatus: 'Select job status',
      executionStatus: 'Select execution status',
      invokeTarget: 'Enter invoke target string'
    },
    rule: {
      jobName: 'Job name is required',
      jobGroup: 'Job group is required',
      invokeTarget: 'Invoke target string is required',
      cronExpression: 'Cron execution expression is required'
    },
    misfirePolicy: {
      immediate: 'Run Immediately',
      once: 'Run Once',
      abandon: 'Skip Run'
    },
    concurrent: {
      allow: 'Allow',
      forbid: 'Forbid'
    }
  },
  routeDiagnostics: {
    duplicateRouteTitle: 'Duplicate Route Name',
    duplicateRouteMessage: 'Route name [{name}] is duplicated and may cause page 404 errors'
  },
  profile: {
    tabsLabel: 'Profile tabs',
    basicInfo: 'Basic Info',
    avatarOnlyNotice: 'Except for the avatar, profile information cannot be edited in the profile center.',
    profileLoadFailed: 'Failed to load profile',
    profileUpdated: 'Updated successfully',
    avatarTitle: 'Change Avatar',
    avatarUploadTitle: 'Click to upload avatar',
    avatarAlt: 'Current avatar',
    avatarPreview: 'Avatar preview',
    avatarSelect: 'Select',
    avatarSubmit: 'Submit',
    avatarZoomIn: 'Zoom in avatar',
    avatarZoomOut: 'Zoom out avatar',
    avatarRotateLeft: 'Rotate left',
    avatarRotateRight: 'Rotate right',
    avatarInvalidType: 'Invalid file format. Please upload an image file such as JPG or PNG.',
    listSeparator: ', ',
    field: {
      phonenumber: 'Mobile',
      email: 'Email',
      dept: 'Department',
      role: 'Roles',
      post: 'Posts',
      createTime: 'Created At',
      loginDate: 'Last Login',
      sex: 'Gender'
    },
    social: {
      tab: 'Third-party Account Management',
      empty: 'No third-party account data',
      loadFailed: 'Failed to load third-party accounts',
      bound: 'Linked',
      unbound: 'Not linked',
      unbind: 'Unlink',
      unbindConfirm: 'Unlink the {name} account? You will no longer be able to sign in with this third-party account.',
      unbindSuccess: 'Unlinked successfully',
      source: {
        dingtalk: 'DingTalk',
        wecom: 'WeCom'
      },
      field: {
        email: 'Account Email',
        bindTime: 'Linked At',
        lastLoginTime: 'Last Login'
      }
    }
  }
};
