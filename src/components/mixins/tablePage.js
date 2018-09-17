const tablePage = {
    data() {
        return {
            //主页分页
            page: {
                current: 1,
                total: 0,
                pageSize: 10,
            },
            page1: {
                current: 1,
                total: 0,
                pageSize: 10,
            },
            page2: {
                current: 1,
                total: 0,
                pageSize: 10,
            },
            pageSizeOpts: [10, 20, 50, 100],
            // 修改成功
            modifySuccess: false,
            modifySuccessInfo: "",
            // table loading
            tloading:false,
        }
    },
    methods: {
        selectedFn(options) {
            this.batch.selectedList = options;
        },
        selectedAllFn(options) {
            this.batch.selectedList = options;
        },
        //列表页
        changePageNumber(number) {
            this.page.current = number;
            this.loadList();
        },
        changePageSize(number) {
            this.page.pageSize = number;
            this.loadList();
        },
        //列表页
        changePageNumber1(number) {
            this.page1.current = number;
            this.loadList1();
        },
        changePageSize1(number) {
            this.page1.pageSize = number;
            this.loadList1();
        },
        //列表页
        changePageNumber2(number) {
            this.page2.current = number;
            this.loadList2();
        },
        changePageSize2(number) {
            this.page2.pageSize = number;
            this.loadList2();
        },
        downLoading () {
            this.$Spin.show({
                render: (h) => {
                    return h('div', [
                        h('Icon', {
                            'class': 'demo-loading-stop',
                            props: {
                                type: 'ios-cloud-download-outline',
                                size: 24
                            }
                        }),
                        h('div', '下载中...')
                    ])
                }
            });
        }
    },
    mounted() {
        //let bodyHeight = $(document).height() - $('.po-header').height() - $('.ivu-tabs-nav-scroll').height();
        //$('.expension-mainterance').css({"overflow-y": "auto", "over-flow-x":"visible", "height": bodyHeight});

    }
}

export default tablePage;
