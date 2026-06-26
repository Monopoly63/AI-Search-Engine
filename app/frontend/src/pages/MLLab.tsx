/**
 * ML Lab — Real Machine Learning on Kaggle Data
 * Dataset: Mental Health in the Workplace (10,000 records, 34 features)
 * All metrics pre-computed from actual sklearn models.
 * By Abdulmoin Hablas
 */
import React, { useState } from 'react';
import { Lang } from './np-i18n';

const ML_DATA = {
  dataset: { rows: 10000, cols: 34, name: "Mental Health in the Workplace" },
  linear_regression: { r2: 0.558, mse: 2.345, slope: 0.200, intercept: -4.984,
    sample: [[40,4.6,3.0],[50,4.4,5.0],[61,5.4,7.2],[40,7.0,3.0],[48,7.5,4.6],[41,2.6,3.2],[39,2.2,2.8],[41,1.7,3.2],[49,3.3,4.8],[50,3.8,5.0],[54,3.8,5.8],[42,5.8,3.4],[49,4.7,4.8],[50,4.4,5.0],[38,2.6,2.6],[40,3.2,3.0],[39,1.6,2.8],[41,5.1,3.2],[54,6.9,5.8],[54,4.8,5.8],[37,1.0,2.4],[35,4.1,2.0],[41,1.8,3.2],[42,2.4,3.4],[52,5.5,5.4],[36,1.0,2.2],[39,1.4,2.8],[49,4.2,4.8],[43,1.3,3.6],[46,2.9,4.2],[56,10.0,6.2],[37,3.9,2.4],[46,6.2,4.2],[47,2.6,4.4],[46,2.8,4.2],[53,4.4,5.6],[44,7.5,3.8],[42,4.0,3.4],[41,2.1,3.2],[25,3.9,0.0],[55,7.5,6.0],[50,3.1,5.0],[44,1.1,3.8],[54,4.4,5.8],[38,1.7,2.6],[55,5.1,6.0],[40,1.5,3.0],[39,3.3,2.8],[42,4.2,3.4],[56,10.0,6.2]] as [number,number,number][],
  },
  kmeans: { n_clusters: 3, inertia: 13307.56,
    sample: [[40,4.6,0],[44,2.1,0],[57,5.7,2],[61,5.4,2],[33,1.3,1],[38,1.0,1],[48,7.5,2],[41,1.0,1],[63,10.0,2],[32,1.0,1],[45,2.5,0],[52,4.0,1],[49,3.3,1],[49,7.2,2],[48,4.3,1],[47,4.3,0],[47,8.1,2],[59,8.1,2],[49,5.0,1],[49,4.9,2],[33,1.0,1],[40,1.4,1],[52,5.2,1],[44,6.2,0],[52,3.6,1],[42,7.2,2],[45,8.3,2],[44,3.7,1],[30,1.9,1],[29,1.0,0],[49,6.7,2],[41,3.5,0],[46,2.9,0],[44,2.5,1],[51,2.7,1],[61,8.0,2],[49,5.5,2],[29,1.0,1],[31,1.0,1],[43,3.0,0],[50,2.1,1],[46,4.4,1],[44,2.5,0],[43,2.0,1],[60,7.5,2],[44,4.3,1],[45,4.4,0],[41,2.7,1],[47,4.0,1],[43,2.7,1]] as [number,number,number][],
    centers: [[40.4,3.2],[42.0,2.7],[54.6,6.8]] as [number,number][],
    labels: ["Low-Risk","Moderate-Risk","High-Burnout"],
  },
  pca: { variance_ratio: [0.410, 0.264], total_preserved: 0.674,
    features: ["work_hours","burnout","productivity","satisfaction","work_life"],
    sample: [[-0.36,-2.21],[-1.46,-0.06],[1.27,-1.30],[1.54,0.24],[-1.61,0.78],[-1.61,0.70],[1.65,-1.72],[-1.93,0.40],[4.32,-1.21],[-2.15,0.26],[-1.18,1.41],[0.27,-0.73],[-0.16,1.80],[1.43,-0.10],[0.21,-0.40],[0.39,-0.28],[2.20,-1.58],[2.88,0.76],[0.82,-0.47],[0.74,1.94],[-1.75,0.17],[-1.34,-1.09],[1.52,-0.39],[0.54,-0.54],[-0.21,0.80],[1.25,-0.42],[1.66,0.46],[0.35,0.07],[-0.69,-2.84],[-1.97,0.90],[0.75,-1.26],[-0.27,0.61],[-0.42,-0.06],[-1.18,0.16],[-0.85,1.07],[3.14,1.44],[0.98,0.22],[-2.06,-0.68],[-1.64,-0.24],[-0.02,-0.13]] as [number,number][],
  },
  decision_tree: { accuracy: 0.760,
    importances: [["overtime_hours",0.559],["work_hours",0.240],["work_life_balance",0.152],["stress_level",0.049],["job_satisfaction",0.000]] as [string,number][],
  },
  isolation_forest: { n_outliers: 496, outlier_pct: 4.96,
    sample: [[40,4.6,1],[44,2.1,1],[57,5.7,1],[61,5.4,1],[33,1.3,1],[38,1.0,1],[48,7.5,1],[41,1.0,1],[63,10.0,-1],[32,1.0,1],[45,2.5,1],[52,4.0,1],[49,3.3,1],[49,7.2,1],[48,4.3,1],[47,4.3,1],[47,8.1,1],[59,8.1,1],[49,5.0,1],[49,4.9,1],[33,1.0,1],[40,1.4,1],[52,5.2,1],[44,6.2,1],[52,3.6,1],[42,7.2,1],[45,8.3,1],[44,3.7,1],[30,1.9,1],[29,1.0,1],[49,6.7,1],[41,3.5,1],[46,2.9,1],[44,2.5,1],[51,2.7,1],[61,8.0,1],[49,5.5,1],[29,1.0,1],[31,1.0,1],[43,3.0,1],[50,2.1,1],[46,4.4,1],[44,2.5,1],[43,2.0,1],[60,7.5,1],[44,4.3,1],[45,4.4,1],[41,2.7,1],[47,4.0,1],[43,2.7,1]] as [number,number,number][],
  },
  random_forest: { r2: 0.679, mse: 1.671,
    importances: [["work_hours",0.319],["overtime_hours",0.315],["work_life_balance",0.167],["job_satisfaction",0.139],["stress_level",0.060]] as [string,number][],
  },
};

type ModuleKey = 'overview'|'lr'|'kmeans'|'pca'|'dt'|'iso'|'rf';
const MODULES: {key:ModuleKey;step:string;label:string;labelAr:string}[] = [
  {key:'overview',step:'00',label:'Dataset',labelAr:'البيانات'},
  {key:'lr',      step:'01',label:'Linear Regression',labelAr:'الانحدار الخطي'},
  {key:'kmeans',  step:'02',label:'K-Means',labelAr:'K-Means'},
  {key:'pca',     step:'03',label:'PCA',labelAr:'PCA'},
  {key:'dt',      step:'04',label:'Decision Tree',labelAr:'شجرة القرار'},
  {key:'iso',     step:'05',label:'Isolation Forest',labelAr:'كشف الشذوذ'},
  {key:'rf',      step:'06',label:'Random Forest',labelAr:'الغابة العشوائية'},
];

const CODES: Record<ModuleKey,string> = {
  overview:`import pandas as pd
df = pd.read_csv("mental_health_workplace.csv")
print(df.shape)        # (10000, 34)
print(df['burnout_risk_score'].describe())`,
  lr:`from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

X = df[['weekly_work_hours']].values
y = df['burnout_risk_score'].values
model = LinearRegression()
model.fit(X, y)
# Slope: 0.1995 | Intercept: -4.984
# R²: 0.558 | MSE: 2.345`,
  kmeans:`from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

X = df[['weekly_work_hours','stress_num','burnout_risk_score']].values
X_s = StandardScaler().fit_transform(X)
km = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = km.fit_predict(X_s)
# Inertia: 13307.56
# Groups: Low-Risk | Moderate | High-Burnout`,
  pca:`from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

features = ['weekly_work_hours','burnout_risk_score',
            'productivity_score','job_satisfaction_score',
            'work_life_balance_score']
X = StandardScaler().fit_transform(df[features].dropna())
pca = PCA(n_components=2)
X_2d = pca.fit_transform(X)
# Variance ratio: [0.410, 0.264] → 67.4% preserved`,
  dt:`from sklearn.tree import DecisionTreeClassifier

y = pd.cut(df['burnout_risk_score'], bins=[0,3,7,10],
           labels=['Low','Medium','High'])
model = DecisionTreeClassifier(max_depth=4, random_state=42)
model.fit(X_train, y_train)
# Accuracy: 76.0%
# Top feature: overtime_hours (55.9%)`,
  iso:`from sklearn.ensemble import IsolationForest

X = df[['weekly_work_hours','burnout_risk_score','stress_num']].values
iso = IsolationForest(contamination=0.05, random_state=42)
preds = iso.fit_predict(X)
# Outliers: 496 (4.96%)
# -1 = outlier, +1 = normal`,
  rf:`from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
# R²: 0.679 | MSE: 1.671
# Best: work_hours (31.9%) + overtime (31.5%)`,
};

/* SVG Charts */
function useScaleXY(data:[number,number][],pad:{t:number,r:number,b:number,l:number},W:number,H:number){
  const xs=data.map(d=>d[0]),ys=data.map(d=>d[1]);
  const xMin=Math.min(...xs),xMax=Math.max(...xs);
  const yMin=Math.min(...ys),yMax=Math.max(...ys);
  return {
    px:(v:number)=>pad.l+((v-xMin)/(xMax-xMin||1))*W,
    py:(v:number)=>pad.t+H-((v-yMin)/(yMax-yMin||1))*H,
  };
}

function Axes({pad,W,H,xLabel,yLabel}:{pad:any;W:number;H:number;xLabel?:string;yLabel?:string}){
  return<>
    <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t+H} stroke="var(--border)" strokeWidth={1}/>
    <line x1={pad.l} y1={pad.t+H} x2={pad.l+W} y2={pad.t+H} stroke="var(--border)" strokeWidth={1}/>
    {xLabel&&<text x={pad.l+W/2} y={pad.t+H+20} textAnchor="middle" fill="var(--fg-dim)" fontSize={9}>{xLabel}</text>}
    {yLabel&&<text x={8} y={pad.t+H/2} textAnchor="middle" fill="var(--fg-dim)" fontSize={9} transform={`rotate(-90,8,${pad.t+H/2})`}>{yLabel}</text>}
  </>;
}

function ScatterChart({data,colorFn,xLabel,yLabel}:{data:[number,number,number][];colorFn:(v:number)=>string;xLabel?:string;yLabel?:string}){
  const pad={t:12,r:8,b:28,l:32};const W=300-pad.l-pad.r;const H=180-pad.t-pad.b;
  const {px,py}=useScaleXY(data.map(d=>[d[0],d[1]]),pad,W,H);
  return<svg width="100%" viewBox="0 0 300 180" className="overflow-visible">
    <Axes pad={pad} W={W} H={H} xLabel={xLabel} yLabel={yLabel}/>
    {data.map(([x,y,c],i)=><circle key={i} cx={px(x)} cy={py(y)} r={3} fill={colorFn(c)} opacity={0.75}/>)}
  </svg>;
}

function LRChart({data}:{data:[number,number,number][]}){
  const pad={t:12,r:8,b:28,l:32};const W=300-pad.l-pad.r;const H=180-pad.t-pad.b;
  const pts=data.map(d=>[d[0],d[1]] as [number,number]);
  const {px,py}=useScaleXY(pts,pad,W,H);
  const pMin=data.reduce((a,b)=>a[0]<b[0]?a:b);
  const pMax=data.reduce((a,b)=>a[0]>b[0]?a:b);
  return<svg width="100%" viewBox="0 0 300 180" className="overflow-visible">
    <Axes pad={pad} W={W} H={H} xLabel="Work Hours" yLabel="Burnout Score"/>
    {data.map(([x,y],i)=><circle key={i} cx={px(x)} cy={py(y)} r={2.5} fill="var(--fg-muted)"opacity={0.7}/>)}
    <line x1={px(pMin[0])} y1={py(pMin[2])} x2={px(pMax[0])} y2={py(pMax[2])} stroke="var(--accent)" strokeWidth={1.5}/>
  </svg>;
}

function BarChart({data}:{data:[string,number][]}){
  const W=300,pad={t:8,r:20,b:8,l:120};
  const H=data.length*26+pad.t+pad.b;
  const max=Math.max(...data.map(d=>d[1]));const bW=W-pad.l-pad.r;
  return<svg width="100%" viewBox={`0 0 ${W} ${H}`}>
    {data.map(([lbl,val],i)=>{
      const y=pad.t+i*26;const bw=(val/max)*bW;
      return<g key={i}>
        <text x={pad.l-6} y={y+16} textAnchor="end" fill="var(--fg-dim)" fontSize={9}>{lbl}</text>
        <rect x={pad.l} y={y+4} width={bw} height={16} rx={2} fill="var(--accent)"/>
        <text x={pad.l+bw+4} y={y+16} fill="var(--fg-muted)" fontSize={9}>{(val*100).toFixed(1)}%</text>
      </g>;
    })}
  </svg>;
}

function PCAScatter({data}:{data:[number,number][]}){
  const pad={t:12,r:8,b:28,l:32};const W=300-pad.l-pad.r;const H=180-pad.t-pad.b;
  const {px,py}=useScaleXY(data,pad,W,H);
  return<svg width="100%" viewBox="0 0 300 180" className="overflow-visible">
    <Axes pad={pad} W={W} H={H} xLabel="PC1 (41.0%)" yLabel="PC2 (26.4%)"/>
    {data.map(([x,y],i)=><circle key={i} cx={px(x)} cy={py(y)} r={3} fill="var(--fg-muted)" opacity={0.8}/>)}
  </svg>;
}

/* Code block */
function CodeBlock({code}:{code:string}){
  const [cp,setCp]=useState(false);
  return<div className="ml-code-block">
    <div className="ml-code-header">
      <span className="ml-code-lang">python</span>
      <button className="ml-copy-btn" onClick={()=>{navigator.clipboard.writeText(code);setCp(true);setTimeout(()=>setCp(false),1500);}}>
        {cp?'✓ copied':'⧉ copy'}
      </button>
    </div>
    <pre className="ml-code-pre"><code>{code}</code></pre>
  </div>;
}

function Pill({label,value,sub}:{label:string;value:string;sub?:string}){
  return<div className="ml-stat-pill">
    <span className="ml-stat-label">{label}</span>
    <span className="ml-stat-value">{value}</span>
    {sub&&<span className="ml-stat-sub">{sub}</span>}
  </div>;
}

/* Module renderers */
function ModuleContent({mod,isRTL}:{mod:ModuleKey;isRTL:boolean}){
  const d=ML_DATA;
  const CLR=['var(--fg-strong)','var(--fg-dim)','var(--fg-muted)'];
  const ISO=(v:number)=>v===-1?'#e05555':'var(--fg-muted)';

  const title=(en:string,ar:string)=>isRTL?ar:en;

  if(mod==='overview')return<div className="ml-content">
    <p className="ml-module-title">{title('Dataset Overview','نظرة عامة على البيانات')}</p>
    <p className="ml-desc">{isRTL?`بيانات حقيقية من Kaggle — ${d.dataset.rows.toLocaleString()} سجل، ${d.dataset.cols} عمود. صحة نفسية في بيئة العمل عبر دول متعددة.`:`Real Kaggle dataset — ${d.dataset.rows.toLocaleString()} records, ${d.dataset.cols} features. Mental health in workplace across multiple countries & industries.`}</p>
    <div className="ml-stats-row">
      <Pill label="Records" value={d.dataset.rows.toLocaleString()} sub="employees"/>
      <Pill label="Features" value={`${d.dataset.cols}`} sub="columns"/>
      <Pill label="Target" value="burnout_score" sub="range: 0–10"/>
      <Pill label="Source" value="Kaggle" sub="real data"/>
    </div>
    <div className="ml-features-grid">
      {['weekly_work_hours','burnout_risk_score','stress_level','productivity_score','job_satisfaction_score','work_life_balance','mental_health_condition','intention_to_leave','annual_salary_usd','exercise_days','sleep_hours'].map(f=><span key={f} className="ml-feature-tag">{f}</span>)}
    </div>
    <CodeBlock code={CODES.overview}/>
  </div>;

  if(mod==='lr')return<div className="ml-content">
    <p className="ml-module-title">{title('Linear Regression — Hours → Burnout Score','الانحدار الخطي — ساعات العمل → درجة الإرهاق')}</p>
    <p className="ml-desc">{isRTL?'burnout = 0.200 × weekly_hours − 4.984 — كل ساعة إضافية أسبوعياً تُضيف 0.2 نقطة إرهاق على المدى البعيد.':'burnout = 0.200 × weekly_hours − 4.984 — each extra weekly hour adds 0.2 burnout points.'}</p>
    <div className="ml-stats-row">
      <Pill label="R² Score" value="0.558" sub="55.8% explained"/>
      <Pill label="MSE" value="2.345"/>
      <Pill label="Slope" value="+0.200" sub="per hour/week"/>
      <Pill label="Intercept" value="−4.984"/>
    </div>
    <div className="ml-chart-box"><LRChart data={d.linear_regression.sample}/></div>
    <CodeBlock code={CODES.lr}/>
  </div>;

  if(mod==='kmeans')return<div className="ml-content">
    <p className="ml-module-title">{title('K-Means — Employee Risk Groups','K-Means — تجميع الموظفين حسب مستوى الخطر')}</p>
    <p className="ml-desc">{isRTL?`تقسيم ${d.dataset.rows.toLocaleString()} موظف إلى 3 مجموعات. كل نقطة موظف حقيقي.`:`${d.dataset.rows.toLocaleString()} employees clustered into 3 groups. Each dot is a real employee.`}</p>
    <div className="ml-stats-row">
      <Pill label="Clusters" value="3"/><Pill label="Inertia" value="13,308"/>
      {d.kmeans.labels.map((l,i)=><Pill key={i} label={`Group ${i}`} value={l}/>)}
    </div>
    <div className="ml-legend-row">
      {d.kmeans.labels.map((l,i)=><span key={i} className="ml-legend-item">
        <span style={{background:CLR[i],width:8,height:8,borderRadius:'50%',display:'inline-block',marginRight:4}}/>
        {l}
      </span>)}
    </div>
    <div className="ml-chart-box">
      <ScatterChart data={d.kmeans.sample} colorFn={v=>CLR[v]||'var(--fg-dim)'} xLabel="Work Hours" yLabel="Burnout Score"/>
    </div>
    <CodeBlock code={CODES.kmeans}/>
  </div>;

  if(mod==='pca')return<div className="ml-content">
    <p className="ml-module-title">{title('PCA — 5D → 2D Dimensionality Reduction','PCA — تقليل الأبعاد من 5D إلى 2D')}</p>
    <p className="ml-desc">{isRTL?'5 خصائص → بُعدان. يحافظ على 67.4% من المعلومات المهمة.':'5 features compressed to 2 dimensions. 67.4% of variance preserved.'}</p>
    <div className="ml-stats-row">
      <Pill label="PC1" value="41.0%" sub="variance"/><Pill label="PC2" value="26.4%" sub="variance"/>
      <Pill label="Total" value="67.4%" sub="preserved"/><Pill label="Dims" value="5 → 2"/>
    </div>
    <div className="ml-pca-bars">
      <div className="ml-pca-bar-wrap"><span className="ml-pca-bar-lbl">PC1</span><div className="ml-pca-bar-fill" style={{width:`${0.41*100}%`}}><span>41.0%</span></div></div>
      <div className="ml-pca-bar-wrap"><span className="ml-pca-bar-lbl">PC2</span><div className="ml-pca-bar-fill ml-pca-bar-2" style={{width:`${0.264*100}%`}}><span>26.4%</span></div></div>
      <div className="ml-pca-bar-wrap"><span className="ml-pca-bar-lbl">PC3+</span><div className="ml-pca-bar-fill ml-pca-bar-3" style={{width:`${0.326*100}%`}}><span>32.6% (discarded)</span></div></div>
    </div>
    <div className="ml-chart-box"><PCAScatter data={d.pca.sample}/></div>
    <CodeBlock code={CODES.pca}/>
  </div>;

  if(mod==='dt')return<div className="ml-content">
    <p className="ml-module-title">{title('Decision Tree — Burnout Risk Classification','شجرة القرار — تصنيف مستوى الإرهاق')}</p>
    <p className="ml-desc">{isRTL?'تصنيف إلى Low/Medium/High بعمق 4 مستويات. أقوى عامل: ساعات الأوفرتايم.':'3-class burnout classification (Low/Medium/High) at depth 4. Top predictor: overtime hours.'}</p>
    <div className="ml-stats-row">
      <Pill label="Accuracy" value="76.0%" sub="test set"/>
      <Pill label="Classes" value="3" sub="Low/Med/High"/>
      <Pill label="Depth" value="4" sub="levels"/>
      <Pill label="Top Feature" value="overtime" sub="55.9%"/>
    </div>
    <div className="ml-chart-box" style={{paddingBottom:8}}>
      <BarChart data={d.decision_tree.importances}/>
    </div>
    <div className="ml-insight-box">💡 overtime_hours explains 55.9% of all decisions — more than all other features combined.</div>
    <CodeBlock code={CODES.dt}/>
  </div>;

  if(mod==='iso')return<div className="ml-content">
    <p className="ml-module-title">{title('Isolation Forest — Anomaly Detection','الغابة المعزولة — كشف القيم الشاذة')}</p>
    <p className="ml-desc">{isRTL?`${d.isolation_forest.n_outliers} سجل شاذ (${d.isolation_forest.outlier_pct}%) من أصل 10,000. النقاط الحمراء أنماط غير طبيعية.`:`${d.isolation_forest.n_outliers} outlier records (${d.isolation_forest.outlier_pct}%) from 10,000. Red dots = abnormal patterns.`}</p>
    <div className="ml-stats-row">
      <Pill label="Outliers" value={`${d.isolation_forest.n_outliers}`} sub="anomalies"/>
      <Pill label="Outlier %" value={`${d.isolation_forest.outlier_pct}%`}/>
      <Pill label="Normal" value="9,504" sub="records"/>
      <Pill label="Threshold" value="5%" sub="contamination"/>
    </div>
    <div className="ml-legend-row">
      <span className="ml-legend-item"><span style={{background:'#e05555',width:8,height:8,borderRadius:'50%',display:'inline-block',marginRight:4}}/>Outlier (−1)</span>
      <span className="ml-legend-item"><span style={{background:'var(--fg-muted)',width:8,height:8,borderRadius:'50%',display:'inline-block',marginRight:4}}/>Normal (+1)</span>
    </div>
    <div className="ml-chart-box">
      <ScatterChart data={d.isolation_forest.sample} colorFn={ISO} xLabel="Work Hours" yLabel="Burnout Score"/>
    </div>
    <CodeBlock code={CODES.iso}/>
  </div>;

  if(mod==='rf')return<div className="ml-content">
    <p className="ml-module-title">{title('Random Forest — Best Regression Model','الغابة العشوائية — أفضل نموذج انحدار')}</p>
    <p className="ml-desc">{isRTL?`100 شجرة مجمّعة. R² = 0.679 — أفضل من الانحدار الخطي (0.558) بـ 12.1%.`:'100 trees ensemble. R²=0.679 — beats Linear Regression (0.558) by +12.1%.'}</p>
    <div className="ml-stats-row">
      <Pill label="R² Score" value="0.679" sub="vs LR: 0.558"/>
      <Pill label="MSE" value="1.671" sub="vs LR: 2.345"/>
      <Pill label="Trees" value="100" sub="estimators"/>
      <Pill label="Improvement" value="+12.1%" sub="over Linear R"/>
    </div>
    <div className="ml-chart-box" style={{paddingBottom:8}}>
      <BarChart data={d.random_forest.importances}/>
    </div>
    <div className="ml-insight-box">💡 Model ranking: Random Forest R²=0.679 &gt; Linear Regression R²=0.558 — ensemble wins.</div>
    <CodeBlock code={CODES.rf}/>
  </div>;

  return null;
}

export default function MLLab({lang}:{lang:Lang}){
  const [active,setActive]=useState<ModuleKey>('overview');
  const isRTL=lang==='ar';
  return<div className="ml-lab-root">
    <div className="ml-tab-bar">
      {MODULES.map(m=><button key={m.key} className={`ml-tab-btn${active===m.key?' ml-tab-active':''}`} onClick={()=>setActive(m.key)}>
        <span className="ml-tab-step">{m.step}</span>
        <span className="ml-tab-label">{isRTL?m.labelAr:m.label}</span>
      </button>)}
    </div>
    <ModuleContent mod={active} isRTL={isRTL}/>
  </div>;
}
