import '@/styles/theme.css';
import './Help.css';

const features = [
  {
    title: '複数のRSSを1画面で管理',
    description:
      'Zenn、Qiita、ニュースサイトなど、気になる更新をまとめて一覧化。情報収集の手間を減らします。',
  },
  {
    title: 'グループで整理',
    description:
      '仕事、趣味、技術メモなどでフィードを分類し、ドラッグで並び替えれば見たい情報をすぐ見つけられます。',
  },
  {
    title: '記事をすぐ確認',
    description:
      '記事を選ぶと記事ペインで読むことができ、横表示設定にすればサイドで流し読みも可能です。',
  },
  {
    title: '音声コンテンツも再生',
    description:
      'RSS内に含まれる音声エンクロージャーがある記事なら、ボタン一つで再生して聞き流せます。',
  },
];

const steps = [
  {
    label: 'Step 1',
    title: 'RSSやWebサイトを追加する',
    text: '「＋ 追加」からRSS/AtomフィードまたはショートカットURLを登録。初期状態ではZennやQiitaなども利用できます。',
  },
  {
    label: 'Step 2',
    title: 'グループで整理する',
    text: '「＋ グループ」でカテゴリを作成し、フィードを整理。見たい順に並べ替えて、毎日の情報収集を快適に。',
  },
  {
    label: 'Step 3',
    title: '更新して確認する',
    text: '「更新」を押すと新着記事を取得。記事を選ぶと本文をプレビューでき、必要に応じて新しいタブで開けます。',
  },
  {
    label: 'Step 4',
    title: '設定を使いこなす',
    text: 'サムネイル表示、記事の横並び表示、設定のエクスポート／インポートで、自分の見方に合わせて管理できます。',
  },
];

const quickActions = [
  { name: '＋ 追加', note: 'RSS/Atomフィードやショートカットを登録' },
  { name: '＋ グループ', note: '情報をカテゴリ別に整理' },
  { name: '更新', note: '新着記事を最新情報に同期' },
  { name: '⚙ 設定', note: 'JSON形式でバックアップと復元' },
];

export default function Help() {
  return (
    <main className="help-page">
      <section className="hero">
        <div className="hero__inner">
          <p className="eyebrow">RSS Blocks</p>
          <h1>RSSを1か所で見て、気になる情報を逃さない。</h1>
          <p className="lead">
            RSS Blocks は、複数の配信元をまとめてチェックできる拡張機能です。
            仕事・趣味・技術情報をひと目で把握し、記事をその場で読む、音声を聞く、必要に応じて保存するまでをスムーズにします。
          </p>
          <div className="hero__actions">
            <a href="#how-to-use" className="button button--primary">
              使い方を見る
            </a>
            <a href="#features" className="button button--secondary">
              機能一覧
            </a>
          </div>
          <ul className="metrics" aria-label="RSS Blocks の特徴">
            <li>
              <strong>複数ソース</strong>
              <span>まとめて閲覧</span>
            </li>
            <li>
              <strong>リアルタイム</strong>
              <span>更新を即反映</span>
            </li>
            <li>
              <strong>記事+音声</strong>
              <span>読み・聞き・確認</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="features" className="section">
        <div className="section__header">
          <p className="eyebrow">Features</p>
          <h2>見やすく、使いやすく、逃さない。</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-card__badge" aria-hidden="true">
                ✓
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-to-use" className="section section--alt">
        <div className="section__header">
          <p className="eyebrow">How to use</p>
          <h2>5分で使い始められる、シンプルな操作.</h2>
        </div>
        <div className="steps">
          {steps.map((step) => (
            <div key={step.label} className="step">
              <span className="step__label">{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="callout">
          <div>
            <p className="eyebrow">Quick actions</p>
            <h2>よく使うボタンを押して、すぐに始めよう</h2>
          </div>
          <div className="action-list">
            {quickActions.map((action) => (
              <div key={action.name} className="action-item">
                <span>{action.name}</span>
                <small>{action.note}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
