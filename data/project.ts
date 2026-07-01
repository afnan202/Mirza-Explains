// data/project.ts
// All structured content for "Mirza Explains" — sourced from the IG-CNN paper
// "Beyond Euclidean Attention: Information-Geometric Deep Learning for
// Automated Bone Health Classification from Knee Radiographs"

export type Stage = {
  id: string;
  index: string; // display number e.g. "01"
  eyebrow: string;
  title: string;
  plain: string; // plain-language explanation
  technical?: string; // expandable technical detail
  bullets?: string[];
  code?: { label: string; lang: string; src: string }[];
};

export const meta = {
  siteName: "Mirza Explains",
  paperTitle:
    "Beyond Euclidean Attention: Information-Geometric Deep Learning for Automated Bone Health Classification from Knee Radiographs",
  authors: "Mirza Afnan Islam, Aniruddha Majumder, Md. Mehedi Hasan",
  tagline:
    "How a CNN learns to read bone density the way a statistician reads a distribution — not a heuristic, a geodesic.",
  headlineStat: { value: "89.95%", label: "test accuracy, three-class staging" },
  supportingStats: [
    { value: "0.8491", label: "Cohen's Kappa" },
    { value: "3,086", label: "knee radiographs, 5 sources" },
    { value: "+4.85%", label: "over ResNet-50 baseline" },
  ],
};

export const stages: Stage[] = [
  {
    id: "introduction",
    index: "01",
    eyebrow: "Why this exists",
    title: "Introduction",
    plain:
      "Osteoporosis quietly erodes bone strength until a small fall causes a fracture that can be life-changing for someone over 65. The clinical gold standard, DEXA scanning, measures density but misses the bone's internal architecture — the part of strength that 20–40% of fracture risk actually depends on. Plain knee X-rays are cheap and everywhere, but reading them for bone health takes a trained eye. This project asks: can a neural network read the geometry of bone the way a radiologist intuits it — not just brightness and texture, but the structure underneath?",
    technical:
      "DXA (Dual-Energy X-ray Absorptiometry) reports a T-score from areal bone mineral density. It does not assess trabecular micro-architecture, cortical geometry, or elastic modulus — properties responsible for 20–40% of bone strength variability. Reporting-template studies additionally show DXA carries non-trivial technical (≈90%) and interpretation (≈42%) error rates that contribute to missed early-stage detection. Knee radiographs, by contrast, are inexpensive, widely available, and already part of routine orthopedic workups — making them an attractive substrate for automated screening if a model can be made sensitive to subtle structural change rather than only pixel intensity.",
    bullets: [
      "One in three women and one in five men over 50 will experience an osteoporotic fracture in developed countries.",
      "Hip fractures carry a 20–30% mortality rate within the first year post-fracture.",
      "DXA misses macro-structural risk factors responsible for 20–40% of bone strength.",
    ],
  },
  {
    id: "problem",
    index: "02",
    eyebrow: "The gap in existing models",
    title: "Problem Statement",
    plain:
      "Most CNNs built for this task — ResNet, VGG, DenseNet, even Vision Transformers — treat every pixel and feature as a fixed number and compare them with a generic dot product. That's the same math whether you're classifying cats or bone density, and it throws away something important: how confident or uncertain each region of the image actually is. Pooling layers then squash everything down by taking the max or the average, which can erase the very edges and boundaries — like the joint space or cortical wall — that a clinician would look at first. And the regularizers used to prevent overfitting are heuristic guesses, not grounded in any theory of what information the network should keep.",
    technical:
      "Three concrete limitations recur across the literature (Table I): (1) attention mechanisms such as SE-Net and CBAM compute weights via deterministic dot-product similarity, ignoring the statistical structure of feature distributions; (2) max/average pooling discards the topological structure of bone micro-architecture, compressing high-fracture-relevance regions identically to uninformative background; (3) no reviewed method incorporates information-theoretic regularization, leaving the compression-vs-accuracy trade-off uncontrolled. Reported knee-radiograph accuracies in prior work range roughly 72.8%–98.9%, but high performers are frequently single-dataset results that have not been shown to generalize (e.g. KONet's 97% on 372 images, or Superfluity DL's drop from 85.4% to 79.4% across datasets).",
  },
  {
    id: "dataset",
    index: "03",
    eyebrow: "What the model learns from",
    title: "Dataset",
    plain:
      "The team assembled 3,086 knee X-rays from five separate public repositories and split them into three clinically meaningful classes: Normal, Osteopenia (early bone loss), and Osteoporosis. The classes are nearly balanced on purpose — that keeps the model from quietly learning to just guess the majority class.",
    technical:
      "Combined from five independent sources [35]–[39] sourced from hospitals and diagnostic centers, originally 8-bit grayscale, captured on a PROTEC PRS 500E X-ray machine. Label encoding follows clinical/epidemiological convention: Normal = 0, Osteopenia = 1, Osteoporosis = 2. Image resolution varies (min 300×162, median ≈338×162, max 640×161), reflecting heterogeneous acquisition across sources — a realistic but harder setting than a single-site dataset.",
    bullets: [
      "Normal: 1,002 images",
      "Osteopenia: 1,056 images",
      "Osteoporosis: 1,028 images",
      "5 independent repositories combined for cross-source variability",
    ],
  },
  {
    id: "preprocessing",
    index: "04",
    eyebrow: "Preparing 3,086 images for training",
    title: "Preprocessing & Augmentation",
    plain:
      "With only ~2,200 training images, the model could easily memorize instead of learn. To stop that, every training image is randomly cropped, flipped, rotated, brightened or darkened, and sometimes blended with another image — each transformation chosen to mimic something that actually varies in real X-ray acquisition, like patient positioning or exposure settings. Validation and test images are left untouched except for resizing, so performance numbers reflect the real task. At test time, each image is evaluated 8 different augmented ways and the predictions are averaged for a steadier final answer.",
    technical:
      "Geometric: random resized crop (scale 0.7–1.0) for partial bone visibility, horizontal flip (p=0.5) for bilateral symmetry, vertical flip (p=0.1) for DICOM orientation artifacts, rotation (±20°) for positioning variability, affine translation (±33%) for landmark displacement. Photometric: brightness/contrast jitter (±40%), sharpness jitter (±90%), adaptive histogram equalization and auto-contrast to simulate PACS windowing. Mixing: MixUp (α=0.4) and CutMix (α=1.0) applied with 50% per-batch probability — x̃ = λxᵢ + (1−λ)xⱼ, ỹ = λyᵢ + (1−λ)yⱼ, λ ~ Beta(α,α). Random erasing (p=0.2, scale 0.02–0.15) adds artifact robustness. All splits are normalized with ImageNet statistics (μ=[0.485,0.456,0.406], σ=[0.229,0.224,0.225]) for backbone compatibility; only train receives geometric/photometric/mixing/erasing transforms, while test additionally uses 8-fold TTA with softmax averaging.",
  },
  {
    id: "architecture",
    index: "05",
    eyebrow: "Three ideas grafted onto a ResNet-50",
    title: "Model Architecture — IG-CNN",
    plain:
      "IG-CNN starts from a familiar ResNet-50 backbone, then changes three things that matter. First, instead of comparing raw numbers, it treats each patch of the feature map as a small probability distribution and measures how 'far apart' two distributions truly are — a Fisher-Rao geodesic distance, not a dot product. Second, instead of just taking the max or average when summarizing the image, it weighs each region by its geometric shape — sharp curves, edges, and boundaries get more say. Third, before making a final decision, it squeezes the representation down to keep only what's predictive of the diagnosis and throw away the rest, with a mathematical guarantee on that trade-off.",
    technical:
      "Input x ∈ ℝ³ˣ²²⁴ˣ²²⁴ flows through a 4-stage ResNet-50 backbone. Fisher Information Attention modules are inserted after stages 2, 3, and 4 (resolutions 28×28×512, 14×14×1024, 7×7×2048), each maintaining an independent learnable Gaussian prior and temperature {μ₀⁽ˡ⁾, σ₀⁽ˡ⁾, Tₗ}. The final 7×7×2048 feature map passes through Manifold Curvature Pooling, then an Information Bottleneck layer, before a softmax classifier over 3 classes.",
  },
  {
    id: "fisher-attention",
    index: "05a",
    eyebrow: "Component 1 of 3",
    title: "Fisher Information Attention",
    plain:
      "Normal attention asks 'how similar are these two feature vectors?' using a dot product. Fisher attention asks a sharper question: 'how surprising is this region, statistically, compared to what a typical region looks like?' Each spot in the feature map becomes a tiny bell-curve (mean and spread) rather than a single number, and the network learns a 'typical' bell-curve to compare every region against. Regions that look statistically ordinary get medium attention; regions that deviate in a meaningful way — large mean shift or oddly different spread — get weighted up or down depending on how relevant that deviation tends to be for the diagnosis.",
    technical:
      "Two parallel 1×1 convolutions estimate μ(h,w) and log σ²(h,w) at every spatial location, defining p(f_{h,w}) = N(μ(h,w), σ²(h,w)). The squared Fisher-Rao distance to a learned prior p₀ = N(μ₀, σ₀²) is d_FR(h,w) = [ (μ−μ₀)²/2 · (1/σ² + 1/σ₀²) + (σ²−σ₀²)²/(8σ²σ₀²) ]^(1/2). Distances are mapped to attention weights via a temperature-scaled sigmoid α(h,w) = 1 / (1 + exp(d_FR²/T)), with T=1.0 balancing spatial specificity and gradient stability. The attended feature is residual: F̃(h,w) = α(h,w)·F(h,w) + F(h,w), so low-attention regions retain their original signal rather than being zeroed out. A sample-complexity argument (Eq. 41–43) shows that, when the Fisher metric aligns with the true feature curvature, the asymptotic MSE bound for Fisher attention (C_F · d/n) can be strictly tighter than for dot-product attention (C_D · λ_max/n).",
    code: [
      {
        label: "fisher_attention.py",
        lang: "python",
        src: `def fisher_rao_distance(mu, log_var, mu0, var0):
    var = log_var.exp()
    term1 = (mu - mu0) ** 2 / 2 * (1 / var + 1 / var0)
    term2 = (var - var0) ** 2 / (8 * var * var0)
    return (term1 + term2).sqrt()

def fisher_attention(F, mu, log_var, mu0, var0, T=1.0):
    d_fr = fisher_rao_distance(mu, log_var, mu0, var0)
    alpha = torch.sigmoid(-(d_fr ** 2) / T)
    return alpha * F + F  # residual: low-attention regions keep signal`,
      },
    ],
  },
  {
    id: "curvature-pooling",
    index: "05b",
    eyebrow: "Component 2 of 3",
    title: "Manifold Curvature Pooling",
    plain:
      "Average pooling treats every pixel in a region the same. Max pooling keeps only the single loudest pixel. Both throw away shape. Curvature pooling instead measures how 'curved' the feature surface is at each point — sharp ridges and saddle points (like the edge of a joint space, or a cortical bone boundary) get more weight when the image is summarized into a single vector, while flat, uninformative regions get less.",
    technical:
      "Gaussian curvature K = κ₁·κ₂ is computed per channel via the Hessian determinant normalized by gradient magnitude: K(h,w) = (f_hh·f_ww − f_hw²) / (1+f_h²+f_w²)². An importance score blends geometric structure with raw magnitude: I_c(h,w) = w_κ·|K_c(h,w)| + w_m·|f_c(h,w)|, with learnable scalars w_κ, w_m (post-training, w_κ > w_m, indicating the model leans on geometric structure). Scores are normalized via softmax over space and used as weights for a pooled sum v_c = Σ α_c(h,w)·f_c(h,w), producing the final C=2048-dim vector. A topological-stability argument (bottleneck-distance bound on persistence diagrams, Eq. 44–47) shows this pooling is Lipschitz-stable: structural features with persistence above a threshold proportional to the pooling radius are provably preserved, unlike hard max-pooling.",
    code: [
      {
        label: "curvature_pooling.py",
        lang: "python",
        src: `def gaussian_curvature(f):
    f_hh = conv2d(f, kernel=[1,-2,1].T)
    f_ww = conv2d(f, kernel=[1,-2,1])
    f_hw = conv2d(f, kernel=mixed_kernel) / 4
    grad_h, grad_w = sobel(f)
    K = (f_hh*f_ww - f_hw**2) / (1 + grad_h**2 + grad_w**2) ** 2
    return K.abs()

def curvature_pool(f, w_kappa, w_m):
    K = gaussian_curvature(f)
    importance = w_kappa * K + w_m * f.abs()
    alpha = softmax_spatial(importance)
    return (alpha * f).sum(dim=[-1, -2])  # -> [B, C]`,
      },
    ],
  },
  {
    id: "info-bottleneck",
    index: "05c",
    eyebrow: "Component 3 of 3",
    title: "Information Bottleneck Regularization",
    plain:
      "Before the final decision, the network is forced through a narrow 'bottleneck.' It's rewarded for keeping anything that helps predict Normal / Osteopenia / Osteoporosis, and penalized for holding onto anything else from the original image. The effect is similar to dropout, but instead of randomly forgetting things, the network is mathematically pushed to discard noise and irrelevant detail on purpose — which tends to produce flatter, more generalizable solutions instead of overfit, sharp ones.",
    technical:
      "Following Tishby & Zaslavsky, the IB objective is max_Z I(Z;Y) − β·I(Z;X). A variational encoder q_φ(z|x) = N(μ_enc(x), diag(σ_enc²(x))) is used with reparameterization z = μ_enc + ε⊙σ_enc, ε~N(0,I), and a standard Gaussian prior p(z)=N(0,I). I(Z;X) is upper-bounded by the closed-form KL divergence KL(q_φ(z|x)‖p(z)) = ½Σᵢ(σ_enc,i² + μ_enc,i² − 1 − log σ_enc,i²), averaged over batch and spatial dimensions to give L_IB. Total loss: L_total = L_CE + β·L_IB + λ_reg‖θ‖² (β=0.01, λ_reg=10⁻⁴), with label smoothing ε=0.1. β is warmed up linearly over the first 20 epochs (β_t = β_max·min(1, t/20)) so basic feature learning isn't choked off before the compression constraint engages.",
    code: [
      {
        label: "information_bottleneck.py",
        lang: "python",
        src: `def ib_loss(mu_enc, log_var_enc):
    var_enc = log_var_enc.exp()
    kl = 0.5 * (var_enc + mu_enc**2 - 1 - log_var_enc)
    return kl.mean()

def total_loss(logits, y, mu_enc, log_var_enc, beta, l2_params, lam=1e-4):
    ce = cross_entropy(logits, y, label_smoothing=0.1)
    l_ib = ib_loss(mu_enc, log_var_enc)
    l2 = sum((p ** 2).sum() for p in l2_params)
    return ce + beta * l_ib + lam * l2`,
      },
    ],
  },
  {
    id: "training",
    index: "06",
    eyebrow: "100 epochs, three competing objectives",
    title: "Training",
    plain:
      "Training has to balance four goals at once: classify correctly, learn good attention priors, learn good curvature weights, and compress the representation — without any one of them dominating early and crowding out the others. The learning rate eases down smoothly over the run (cosine annealing), and the compression penalty is deliberately introduced slowly over the first 20 epochs so the network learns useful features before being asked to compress them.",
    technical:
      "Optimizer: AdamW with gradient clipping (max norm 1.0) — necessary given the second-derivative curvature computation and stochastic IB sampling in the graph. Batch size 16. Learning rate follows cosine annealing η_t = η_min + (η_max−η_min)·(1+cos(πt/T))/2, η_max=10⁻⁴, η_min=10⁻⁶, T=100 epochs. Early stopping on validation loss with patience 10. Fisher priors {μ₀, σ₀} initialize at standard Gaussian (0,1), thresholds Tₗ=1, and adapt via backprop: priors drift toward recurrent feature distributions, while T shrinks when distances are small/consistent (sharper attention) and grows when distances are large/variable (softer attention). Training converges within 80–100 epochs.",
  },
  {
    id: "validation",
    index: "07",
    eyebrow: "Watching for overfitting in real time",
    title: "Validation",
    plain:
      "Through 100 epochs, training and validation accuracy track each other closely instead of drifting apart — the classic sign that a model is overfitting. Validation loss flattens out around epoch 60, and the bottleneck's own compression loss drops fast and stays low, which the authors read as evidence that the regularization is doing its job rather than just adding noise.",
    bullets: [
      "Validation accuracy converges to 89.95% without a significant train/val gap",
      "Validation loss stabilizes around epoch 60",
      "Information Bottleneck loss decreases sharply in the first ~10 epochs, then plateaus low",
    ],
  },
  {
    id: "evaluation",
    index: "08",
    eyebrow: "Head-to-head against standard backbones",
    title: "Evaluation",
    plain:
      "IG-CNN was compared against five widely-used architectures — ResNet-50, VGG-16, DenseNet-121, EfficientNet-B0, and Inception-V3 — all trained on the exact same data and splits, so the comparison is apples-to-apples. IG-CNN comes out ahead on every metric.",
    technical:
      "Metrics: Accuracy, Precision, Recall, Cohen's Kappa, plus ROC/AUC for discriminative power. IG-CNN: 89.95% accuracy, κ=0.8491, precision/recall ≈0.900/0.900 — a consistent margin over the next-best baseline (EfficientNet-B0, 87.15%).",
  },
  {
    id: "explainability",
    index: "09",
    eyebrow: "Does the model look where a clinician would?",
    title: "Explainability",
    plain:
      "Projecting Fisher attention back onto the original X-ray shows the model isn't just pattern-matching pixels — for Osteopenia, attention concentrates on the joint space and medial compartment, exactly where early bone loss tends to show up. For Normal scans, attention shifts to the tibial shaft. A 3D view of the Fisher information manifold also shows correctly classified samples clustering at moderately negative curvature, while misclassified samples scatter more broadly near zero curvature — meaning prediction confidence and learned geometry are linked, not arbitrary.",
    bullets: [
      "Osteopenia (Label 1): attention concentrates at the joint space and medial compartment",
      "Normal (Label 0): attention centers on the tibial shaft",
      "Correctly classified samples cluster at moderately negative Gaussian curvature on the learned manifold",
      "Loss landscape analysis shows convergence to a flat, wide minimum — associated with better generalization than sharp minima",
    ],
  },
  {
    id: "results",
    index: "10",
    eyebrow: "What actually happened, class by class",
    title: "Results",
    plain:
      "Overall, IG-CNN gets 89.95% of test images right, with strong agreement beyond chance (Kappa 0.8491). It's strongest on Osteoporosis — the class where missing a case is most dangerous — and most often confuses Normal with Osteopenia, which lines up with how subtle early bone loss looks on a plain X-ray even to trained eyes.",
    bullets: [
      "Normal: F1 0.8792 (precision 0.8505, recall 0.9100)",
      "Osteopenia: F1 0.8578 (precision 0.8883, recall 0.8294) — hardest class, visually close to healthy bone",
      "Osteoporosis: F1 0.9612 (precision 0.9612, recall 0.9612) — highest-stakes class, classified most reliably",
      "Most confusion occurs between Normal and Osteopenia, the clinically expected failure mode",
    ],
  },
  {
    id: "ablation",
    index: "11",
    eyebrow: "Which piece matters most?",
    title: "Ablation Study",
    plain:
      "Removing each of the three innovations one at a time, and swapping in the 'normal' alternative instead, shows Fisher Attention matters most — losing it costs 3.54 accuracy points, more than losing curvature pooling (2.72 points) or the information bottleneck (2.06 points). But the three components together gain more than the sum of their individual contributions, which means they reinforce each other rather than just stacking independently.",
    technical:
      "Ablated variants substitute standard counterparts to keep parameter count comparable: channel-wise average pooling replaces Fisher Attention, global average pooling replaces Curvature Pooling, standard dropout (p=0.5) replaces the IB layer. Cumulative isolated gains (3.54+2.72+2.06=8.32%) exceed the actual full-model gain over ResNet-50 (4.85%) only in the additive sense — the components are non-additive, consistent with a coherent pipeline where Fisher-attended features become more useful inputs to curvature pooling, which in turn hands a cleaner representation to the bottleneck.",
  },
  {
    id: "conclusion",
    index: "12",
    eyebrow: "Where this goes next",
    title: "Conclusion & Future Work",
    plain:
      "IG-CNN shows that grounding three unglamorous CNN components — attention, pooling, and regularization — in actual statistical and geometric theory, rather than heuristics, produces a measurable, interpretable improvement on a real diagnostic task. The natural next steps are federated training across hospitals without sharing patient data, richer multivariate Fisher attention that captures cross-channel statistics, learnable Riemannian metrics in place of the fixed Fisher-Rao distance, and fusing this imaging pipeline with wearable biomechanical sensor data for continuous fracture-risk prediction.",
    bullets: [
      "Federated learning across decentralized hospital nodes",
      "Multivariate Gaussian Fisher attention to capture inter-channel dependencies",
      "Learnable Riemannian metric tensors in place of fixed Fisher-Rao geodesics",
      "Multimodal fusion with wearable biomechanical sensor data",
    ],
  },
];

export const pipelineNodes = [
  { id: "input", label: "Input X-ray", sub: "224×224×3", x: 4, y: 50 },
  { id: "stage1", label: "Stage 1", sub: "ResNet-50", x: 16, y: 50 },
  { id: "stage2", label: "Stage 2", sub: "28×28×512", x: 28, y: 50 },
  { id: "fa1", label: "Fisher Attention", sub: "scale 1", x: 28, y: 18 },
  { id: "stage3", label: "Stage 3", sub: "14×14×1024", x: 42, y: 50 },
  { id: "fa2", label: "Fisher Attention", sub: "scale 2", x: 42, y: 18 },
  { id: "stage4", label: "Stage 4", sub: "7×7×2048", x: 56, y: 50 },
  { id: "fa3", label: "Fisher Attention", sub: "scale 3", x: 56, y: 18 },
  { id: "curvature", label: "Curvature Pooling", sub: "Gaussian K", x: 70, y: 50 },
  { id: "ib", label: "Info Bottleneck", sub: "I(Z;X) vs I(Z;Y)", x: 83, y: 50 },
  { id: "output", label: "Softmax", sub: "3 classes", x: 95, y: 50 },
];

export const pipelineEdges = [
  ["input", "stage1"],
  ["stage1", "stage2"],
  ["stage2", "fa1"],
  ["fa1", "stage3"],
  ["stage2", "stage3"],
  ["stage3", "fa2"],
  ["fa2", "stage4"],
  ["stage3", "stage4"],
  ["stage4", "fa3"],
  ["fa3", "curvature"],
  ["stage4", "curvature"],
  ["curvature", "ib"],
  ["ib", "output"],
];

export const comparisonData = [
  { model: "VGG-16", accuracy: 83.47, kappa: 0.741 },
  { model: "ResNet-50", accuracy: 85.1, kappa: 0.762 },
  { model: "Inception-V3", accuracy: 86.8, kappa: 0.786 },
  { model: "DenseNet-121", accuracy: 86.23, kappa: 0.778 },
  { model: "EfficientNet-B0", accuracy: 87.15, kappa: 0.791 },
  { model: "IG-CNN (Ours)", accuracy: 89.95, kappa: 0.8491 },
];

export const ablationData = [
  { variant: "ResNet-50 Baseline", accuracy: 85.1, kappa: 0.762 },
  { variant: "w/o Fisher Attention", accuracy: 86.41, kappa: 0.781 },
  { variant: "w/o Curvature Pooling", accuracy: 87.23, kappa: 0.793 },
  { variant: "w/o Info Bottleneck", accuracy: 87.89, kappa: 0.801 },
  { variant: "IG-CNN (Full Model)", accuracy: 89.95, kappa: 0.8419 },
];

export const perClassData = [
  { name: "Normal", precision: 0.8505, recall: 0.91, f1: 0.8792, support: 200 },
  { name: "Osteopenia", precision: 0.8883, recall: 0.8294, f1: 0.8578, support: 211 },
  { name: "Osteoporosis", precision: 0.9612, recall: 0.9612, f1: 0.9612, support: 206 },
];

export const confusionMatrix = {
  labels: ["Normal", "Osteopenia", "Osteoporosis"],
  matrix: [
    [182, 16, 2],
    [30, 175, 6],
    [2, 6, 198],
  ],
};

// Training curves reconstructed from the paper's reported convergence behavior
// (steady joint train/val convergence to ~89.95%, val loss stabilizing ~epoch 60,
// IB loss collapsing within the first ~10 epochs).
export function generateTrainingCurve() {
  const points = [];
  for (let epoch = 1; epoch <= 100; epoch++) {
    const trainAcc = 55 + 35 * (1 - Math.exp(-epoch / 14)) + (Math.random() - 0.5) * 1.4;
    const valAcc =
      52 + 38 * (1 - Math.exp(-epoch / 16)) + (Math.random() - 0.5) * 2.2 - (epoch > 60 ? 0 : 0);
    const trainLoss = 1.5 * Math.exp(-epoch / 18) + 0.42 + (Math.random() - 0.5) * 0.03;
    const valLoss =
      1.55 * Math.exp(-epoch / 20) + 0.48 + (epoch > 60 ? (Math.random() - 0.5) * 0.05 : (Math.random() - 0.5) * 0.08);
    const ibLoss = 25 * Math.exp(-epoch / 4) + 0.6 + (Math.random() - 0.5) * 0.1;
    points.push({
      epoch,
      trainAcc: Math.min(96, +trainAcc.toFixed(2)),
      valAcc: Math.min(91.5, +valAcc.toFixed(2)),
      trainLoss: +Math.max(trainLoss, 0.3).toFixed(3),
      valLoss: +Math.max(valLoss, 0.35).toFixed(3),
      ibLoss: +Math.max(ibLoss, 0.4).toFixed(3),
    });
  }
  return points;
}
