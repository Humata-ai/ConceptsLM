# Glossary

## Abstract

This data model represents concepts as geometric structures in multi-dimensional spaces. Each conceptual space is composed of quality dimensions that define the axes along which objects can vary. Concepts are represented as regions within these spaces, and linguistic labels provide the mapping between language and geometric representation.

---

## Terms

### Achievement

A punctual event involving an abrupt change of state (e.g., *arrive*, *die*).
Geometrically: a discontinuous jump between regions in an event domain.

### Action

An event with an intentional agent.
Geometrically: a force-driven trajectory initiated by an agent vector.

### Action Category

A region in event space grouping similar action trajectories (e.g., *cutting*, *throwing*).

### Activity

An ongoing, unbounded event without a natural endpoint (e.g., *running*).
Geometrically: an open-ended trajectory.

### Agent

The entity exerting force and initiating an action.
Defined by intentionality, control, and causal origin.

### Antonym

Two lexical items occupying opposing regions within a scalable domain (e.g., *hot* / *cold*).

### Classificatory Domain

A domain primarily used to distinguish kinds (e.g., animal vs artifact).

### Comparatives

Expressions ordering entities along a scalable dimension (e.g., *taller than*).
Require an ordered metric structure.

### Concept

A convex region in a conceptual space.

### Concept Formation

Creation of a convex region from clustered experiences.

### Conceptual Blending

Partial overlap of regions from different domains producing new structure.

### Conceptual Combination

Geometric operations on regions (intersection, projection, weighting).

### Conceptual Neighborhood

Nearby regions in space representing related concepts.

### Conceptual Space

A geometric representational framework defined by quality dimensions.

### Construal

A way of structuring and foregrounding aspects of a conceptual space.
Implemented via salience weighting. Representation of perspective.

### Convexity

If two points belong to a concept, all intermediate points belong.
Crucial for induction and generalization.

### Count Noun

Refers to individuated entities (e.g., *chair*).
Geometrically: discrete bounded regions.

### Domain

A set of integral quality dimensions forming a coherent subspace.

### Emergent Property

A feature appearing in conceptual combination not prominent in components.

### Event

A trajectory or structured change over time in conceptual space.

### Event Construal

This is the internal mental representation of a scene. Models an event as a complex structure in conceptual spaces, typically involving a force vector (the cause) and a result vector (the effect). A construal is the specific way a speaker chooses to focus their attention on certain parts of that event.

### Exemplar

A stored instance within a concept region.

### Force

A vector representing magnitude and direction of causal influence.

### Generics

Statements about kinds (e.g., "Dogs bark").
Refer to prototype-level properties.

### Goal

Target region guiding a trajectory.

### Hierarchical Relations

Nested region containment reflecting levels of abstraction (e.g., *scarlet* ⊂ *red*).

### Homeomorphic Correspondence

Structure-preserving mapping between conceptual spaces. The geometric basis for metaphor.

### Integral Dimensions

Dimensions that cannot vary independently (e.g., hue and brightness).

### Manner Verb

Encodes how an action occurs (e.g., *run*). Quality domain.

### Mass Noun

Refers to undifferentiated substance (e.g., *water*). Material domain most salient.

### Meronomic Relations

Part–whole relations (e.g., *wheel* → *car*).
Represent internal topology of regions. Basis for metonymy.

### Metaphor

Cross-domain mapping via homeomorphic correspondence.

### Metonymy

Reference shift within a domain via structured adjacency.

### Name (Proper Name)

Refers to a specific point or tightly bounded region. Individual objects are represented as specific points within an object category space.

### Natural Concept

Grounded in perceptual domains.

### Nonscalable Domain

Domain without ordered metric structure (e.g., hue, circle).

### Object Category (Noun)

An object category is a structured region across multiple domains that corresponds to nouns in natural language. When we use a common noun like "apple," "bird," or "chair," we are referring to a concept represented as an object category in conceptual space.

An object category is determined by:

1. A set of relevant domains (may be expanded over time)
2. A set of convex regions in these domains (in some cases, the region may be the entire domain)
3. Prominence weights of the domains (dependent on context)
4. Information about how the regions in different domains are correlated
5. Information about meronomic (part-whole) relations

Examples of object categories might include:

- Apple: regions in color domain (red, green, yellow), shape domain (roundness, size), taste domain (sweetness, tartness), texture domain (crispness, smoothness)
- Bird: regions in shape domain, size domain, color domain, with meronomic relations (has wings, has beak, has feathers)
- Chair: regions in shape domain (back, seat, legs), size domain, material domain, with specific part-whole structure

The prominence weights allow context-dependent emphasis. For example, when identifying fruit, the color and taste domains might be more prominent than texture, while when packing fruit for shipping, size and firmness become more prominent.

### Objects (Names)

Objects (or individuals) can be represented as points in a conceptual space and correspond to proper names in natural language. When we use a name like "Socrates" or "Mount Everest," we are referring to a specific individual represented as a point in conceptual space. Such a point is a vector of coordinates, one for each dimension in the space. In this way, each physical object can be allocated a specific spatial position, color, weight, shape, size, temperature, and so on.

Objects are a special kind of category where all regions (or known regions) of the domains are reduced to points. This means:

- Objects always have internally consistent properties. Since "blue" and "yellow" are disjoint properties in the color space, no object can be both blue and yellow (all over). This eliminates the need for meaning postulates to exclude contradictory properties.

- The vectors are cognitive construals and do not necessarily represent all properties of a real object. For example, one can perceive a horse without representing its smell. Such partial representations use partial vectors where arguments for some dimensions are undetermined.

- Objects can be seen as very narrow categories—points are simply regions with minimal extent. This provides the cognitive foundation for why nouns and names have similar semantic and syntactic functions in language: they represent the same underlying geometric structure at different levels of specificity.

Examples:
- A specific apple as a point: precise coordinates in color (RGB values), shape (exact curvature measurements), taste (specific sweetness level), spatial location (x, y, z coordinates)
- Two identical books distinguished only by their spatial locations
- An imagined horse represented with partial vector (visual properties known, smell undetermined)

### Patient

Entity undergoing change due to force.

### Property (Adjective)

A property is a convex region of a domain. For example in the color domain there is a convex region labeled "red" which we call a property of that space. As it turns out convex regions of a conceptual space correspond to adjectives in english.

Examples of properties and the corresponding domain:
- red, blue → color domain
- tall, short → spatial / size domain
- heavy, light → weight domain
- sweet, bitter → taste domain

Property (and therefore adjectives) are represented as a convex region in a single domain. Some adjectives like "healthy" require an "illness-health domain" to support the single domain rule.

### Prototype

Central, most typical point of a region.

### Quality Dimensions

Quality dimensions are the fundamental building blocks of conceptual spaces. Each dimension represents a single quality along which entities can vary. Dimensions can be continuous (like temperature or brightness) or discrete (like number of sides).

Multiple quality dimensions combine to form a conceptual space. The number and nature of dimensions varies by the domain being modeled.

### Quality Domain

A quality domain is a collection of related quality dimensions that together characterize a particular aspect of experience or perception. Domains provide a natural grouping of dimensions that tend to co-vary or be processed together cognitively.

For example, the color domain combines three quality dimensions: hue (the spectrum from red through violet), saturation (the intensity or purity of the color), and brightness (the lightness or darkness). Together, these three dimensions form a complete characterization of color perception, and any specific color can be located as a point within this three-dimensional quality domain.

### Radial Projection

Projection from higher-dimensional space onto subspace via chosen center.
Basis for metonymy.

### Region

A connected subset of a conceptual space representing a concept.

### Result

Final state reached after trajectory.

### Result Verb

Encodes outcome of event (e.g., *break*).

### Salience

Context-dependent weighting of dimensions or domains.
Implemented as dynamic metric adjustment.

### Scalable Domain

Ordered domain supporting comparatives (e.g., temperature).

### Separable Dimensions

Dimensions that vary independently.

### Similarity

Inverse function of distance in conceptual space.

### Specification Function

Narrows a region within a domain (often adjectives).

### Subconceptual Level

Neural/connectionist representation layer.

### Symbolic Level

Discrete, language-like representational layer.

### Synonym

Two lexical items whose regions largely overlap in the same domain.

### Trajectory

A path through conceptual space representing change.

### Typicality Gradient

Graded membership determined by distance from prototype.
