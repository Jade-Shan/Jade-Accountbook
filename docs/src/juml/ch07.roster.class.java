/** @hidden */ class Int {}
/** @hidden */ class Option<T> {}
/** @hidden */ class Map<T, G> {}
/** @hidden */ class Pattern {}
/** @opt all */ interface Actor {}
/** @hidden */ class Connection {}

/** @opt all */
class Jid {
	private Pattern jidPattern;

	private String local;
	private String domain;
	private String resource;
	
	public Jid(String local, String domain, String resource){}

	public static Option<Jid> fromString(String str) {return null;}
	public static Option<Jid> apply(String local, String domain, String resource) {return null;}
}


/**
 * @opt all
 */
enum Subscription {
	single, both;
}

/**
 * @composed 1..1 Has 1..1 Jid
 * @opt all
 */
class Presence {
	private Jid jid;
	private Int priority;
	private String status;
	private String show;
}

/** 
 * @composed 1..1 Has 1..1 Jid
 * @composed 1..1 Has 1..1 Presence
 * @composed 1..1 Has 1..1 Subscription
 *
 * @opt all 
 */
class Member {
	private Jid jid;
	private Presence presence;
	private Subscription subscription;

	public void updatePresence(Presence presence){};
}

/**
 * @has 1..1 Has 1..1 Member
 *
 * @opt all
 */
class Roster implements Actor {
	private Map<String, Member> members;

	private Member getMemberFromMap(Jid jid) {return null;}

	public void updatePresence(Presence presence){};
}
