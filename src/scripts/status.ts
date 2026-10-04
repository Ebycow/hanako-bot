// Bot の稼働状況。Better Stack のステータスページの公開JSON（CORS 許可あり）から読む。
// ヘッダーとフッターの両方で使うので、読み込みは1ページにつき1回だけにする。
// キーはステータスページの表示名（public_name）、値は operational / degraded / downtime / maintenance

export const STATUS_PAGE_URL = 'https://status.ebycow.net/';

interface Resource {
    type: string;
    attributes: { public_name: string; status: string };
}

let statuses: Promise<Map<string, string>> | undefined;

export const fetchStatuses = () =>
    (statuses ??= fetch(new URL('index.json', STATUS_PAGE_URL))
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then(
            (json: { included?: Resource[] }) =>
                new Map(
                    (json.included ?? [])
                        .filter((r) => r.type === 'status_page_resource')
                        .map((r) => [r.attributes.public_name, r.attributes.status]),
                ),
        ));
