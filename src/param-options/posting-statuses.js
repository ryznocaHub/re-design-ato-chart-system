/*
* +----+--------------------------+
| id | name                     |
+----+--------------------------+
|  0 | 原稿審査承認前           |
|  1 | 原稿審査確認中           |
|  2 | 原稿審査承認済み         |
|  3 | 配布依頼中               |
|  4 | 配布完了報告待ち         |
|  5 | 配布完了報告済み         |
|  6 | 原稿審査承認NG           |
|  7 | キャンセル               |
+----+--------------------------+
*
* */


const postingStatuses = [
    {
        name_j: '全配布ステータス',
        id: -1
    },
    {
        name_j: '原稿審査承認前',
        id: 0
    },
    {
        name_j: '原稿審査確認中',
        id: 1
    },
    {
        name_j: '原稿審査承認済み',
        id: 2
    },
    {
        name_j: '配布依頼中',
        id: 3
    },
    {
        name_j: '配布完了報告待ち',
        id: 4
    },
    {
        name_j: '配布完了報告済み',
        id: 5
    },
    {
        name_j: '原稿審査承認NG',
        id: 6
    },
    {
        name_j: 'キャンセル',
        id: 7
    }
]

export {
  postingStatuses
}